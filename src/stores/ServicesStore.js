import { shell } from 'electron';
import { action, reaction, computed, observable } from 'mobx';
import { debounce, remove } from 'lodash';
import ms from 'ms';
import { ensureFileSync, pathExistsSync, writeFileSync } from 'fs-extra';
import { join } from 'path';

import Store from './lib/Store';
import Request from './lib/Request';
import CachedRequest from './lib/CachedRequest';
import { matchRoute } from '../helpers/routing-helpers';
import { isInTimeframe } from '../helpers/schedule-helpers';
import {
  getRecipeDirectory,
  getDevRecipeDirectory,
} from '../helpers/recipe-helpers';
import { workspaceStore } from '../features/workspaces';
import { KEEP_WS_LOADED_USID } from '../config';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';
import { ferdiVersion } from '../environment';

const debug = require('debug')('Ferdi:ServiceStore');

export default class ServicesStore extends Store {
  @observable allServicesRequest = new CachedRequest(this.api.services, 'all');

  @observable createServiceRequest = new Request(this.api.services, 'create');

  @observable updateServiceRequest = new Request(this.api.services, 'update');

  @observable reorderServicesRequest = new Request(
    this.api.services,
    'reorder',
  );

  @observable deleteServiceRequest = new Request(this.api.services, 'delete');

  @observable clearCacheRequest = new Request(this.api.services, 'clearCache');

  @observable filterNeedle = null;

  // Array of service IDs that have recently been used
  // [0] => Most recent, [n] => Least recent
  // No service ID should be in the list multiple times, not all service IDs have to be in the list
  @observable lastUsedServices = [];

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.service.setActive.listen(this._setActive.bind(this));
    this.actions.service.blurActive.listen(this._blurActive.bind(this));
    this.actions.service.setActiveNext.listen(this._setActiveNext.bind(this));
    this.actions.service.setActivePrev.listen(this._setActivePrev.bind(this));
    this.actions.service.showAddServiceInterface.listen(
      this._showAddServiceInterface.bind(this),
    );
    this.actions.service.createService.listen(this._createService.bind(this));
    this.actions.service.createFromLegacyService.listen(
      this._createFromLegacyService.bind(this),
    );
    this.actions.service.updateService.listen(this._updateService.bind(this));
    this.actions.service.deleteService.listen(this._deleteService.bind(this));
    this.actions.service.openRecipeFile.listen(this._openRecipeFile.bind(this));
    this.actions.service.clearCache.listen(this._clearCache.bind(this));
    this.actions.service.setWebviewReference.listen(
      this._setWebviewReference.bind(this),
    );
    this.actions.service.detachService.listen(this._detachService.bind(this));
    this.actions.service.focusService.listen(this._focusService.bind(this));
    this.actions.service.focusActiveService.listen(
      this._focusActiveService.bind(this),
    );
    this.actions.service.toggleService.listen(this._toggleService.bind(this));
    this.actions.service.handleIPCMessage.listen(
      this._handleIPCMessage.bind(this),
    );
    this.actions.service.sendIPCMessage.listen(this._sendIPCMessage.bind(this));
    this.actions.service.sendIPCMessageToAllServices.listen(
      this._sendIPCMessageToAllServices.bind(this),
    );
    this.actions.service.setUnreadMessageCount.listen(
      this._setUnreadMessageCount.bind(this),
    );
    this.actions.service.openWindow.listen(this._openWindow.bind(this));
    this.actions.service.filter.listen(this._filter.bind(this));
    this.actions.service.resetFilter.listen(this._resetFilter.bind(this));
    this.actions.service.resetStatus.listen(this._resetStatus.bind(this));
    this.actions.service.reload.listen(this._reload.bind(this));
    this.actions.service.reloadActive.listen(this._reloadActive.bind(this));
    this.actions.service.reloadAll.listen(this._reloadAll.bind(this));
    this.actions.service.reloadUpdatedServices.listen(
      this._reloadUpdatedServices.bind(this),
    );
    this.actions.service.reorder.listen(this._reorder.bind(this));
    this.actions.service.toggleNotifications.listen(
      this._toggleNotifications.bind(this),
    );
    this.actions.service.toggleAudio.listen(this._toggleAudio.bind(this));
    this.actions.service.toggleDarkMode.listen(this._toggleDarkMode.bind(this));
    this.actions.service.openDevTools.listen(this._openDevTools.bind(this));
    this.actions.service.openDevToolsForActiveService.listen(
      this._openDevToolsForActiveService.bind(this),
    );
    this.actions.service.hibernate.listen(this._hibernate.bind(this));
    this.actions.service.awake.listen(this._awake.bind(this));
    this.actions.service.resetLastPollTimer.listen(
      this._resetLastPollTimer.bind(this),
    );
    this.actions.service.shareSettingsWithServiceProcess.listen(
      this._shareSettingsWithServiceProcess.bind(this),
    );

    this.registerReactions([
      this._focusServiceReaction.bind(this),
      this._getUnreadMessageCountReaction.bind(this),
      this._mapActiveServiceToServiceModelReaction.bind(this),
      this._saveActiveService.bind(this),
      this._logoutReaction.bind(this),
      this._handleMuteSettings.bind(this),
      this._checkForActiveService.bind(this),
    ]);

    // Just bind this
    this._initializeServiceRecipeInWebview.bind(this);
  }

  setup() {
    // Single key reactions for the sake of your CPU
    reaction(
      () => this.stores.settings.app.enableSpellchecking,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );

    reaction(
      () => this.stores.settings.app.spellcheckerLanguage,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );

    reaction(
      () => this.stores.settings.app.darkMode,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );

    reaction(
      () => this.stores.settings.app.adaptableDarkMode,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );

    reaction(
      () => this.stores.settings.app.universalDarkMode,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );

    reaction(
      () => this.stores.settings.app.splitMode,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );

    reaction(
      () => this.stores.settings.app.searchEngine,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );

    reaction(
      () => this.stores.settings.app.clipboardNotifications,
      () => {
        this._shareSettingsWithServiceProcess();
      },
    );
  }

  initialize() {
    super.initialize();

    // Check services to become hibernated
    this.serviceMaintenanceTick();
  }

  teardown() {
    super.teardown();

    // Stop checking services for hibernation
    this.serviceMaintenanceTick.cancel();
  }

  /**
   * Сheck for services to become hibernated.
   */
  serviceMaintenanceTick = debounce(() => {
    this._serviceMaintenance();
    this.serviceMaintenanceTick();
    debug('Service maintenance tick');
  }, ms('10s'));

  /**
   * Run various maintenance tasks on services
   */
  _serviceMaintenance() {
    for (const service of this.enabled) {
      // Defines which services should be hibernated or woken up
      if (!service.isActive) {
        if (
          !service.lastHibernated &&
          Date.now() - service.lastUsed >
            ms(`${this.stores.settings.all.app.hibernationStrategy}s`)
        ) {
          // If service is stale, hibernate it.
          this._hibernate({ serviceId: service.id });
        }

        if (
          service.lastHibernated &&
          Number(this.stores.settings.all.app.wakeUpStrategy) > 0 &&
          Date.now() - service.lastHibernated >
            ms(`${this.stores.settings.all.app.wakeUpStrategy}s`)
        ) {
          // If service is in hibernation and the wakeup time has elapsed, wake it.
          this._awake({ serviceId: service.id });
        }
      }

      if (
        service.lastPoll &&
        service.lastPoll - service.lastPollAnswer > ms('1m')
      ) {
        // If service did not reply for more than 1m try to reload.
        if (!service.isActive) {
          if (this.stores.app.isOnline && service.lostRecipeReloadAttempt < 3) {
            debug(
              `Reloading service: ${service.name} (${service.id}). Attempt: ${service.lostRecipeReloadAttempt}`,
            );
            // service.webview.reload();
            service.lostRecipeReloadAttempt += 1;

            service.lostRecipeConnection = false;
          }
        } else {
          debug(`Service lost connection: ${service.name} (${service.id}).`);
          service.lostRecipeConnection = true;
        }
      } else {
        service.lostRecipeConnection = false;
        service.lostRecipeReloadAttempt = 0;
      }
    }
  }

  // Computed props
  @computed get all() {
    if (this.stores.user.isLoggedIn) {
      const services = this.allServicesRequest.execute().result;
      if (services) {
        return observable(
          [...services]
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s, index) => {
              s.index = index;
              return s;
            }),
        );
      }
    }
    return [];
  }

  @computed get enabled() {
    return this.all.filter(service => service.isEnabled);
  }

  @computed get allDisplayed() {
    const services = this.stores.settings.all.app.showDisabledServices
      ? this.all
      : this.enabled;
    return workspaceStore.filterServicesByActiveWorkspace(services);
  }

  // This is just used to avoid unnecessary rerendering of resource-heavy webviews
  @computed get allDisplayedUnordered() {
    const { showDisabledServices } = this.stores.settings.all.app;
    const { keepAllWorkspacesLoaded } = this.stores.workspaces.settings;
    const services = this.allServicesRequest.execute().result || [];
    const filteredServices = showDisabledServices
      ? services
      : services.filter(service => service.isEnabled);

    let displayedServices;
    if (keepAllWorkspacesLoaded) {
      // Keep all enabled services loaded
      displayedServices = filteredServices;
    } else {
      // Keep all services in current workspace loaded
      displayedServices =
        workspaceStore.filterServicesByActiveWorkspace(filteredServices);

      // Keep all services active in workspaces that should be kept loaded
      for (const workspace of this.stores.workspaces.workspaces) {
        // Check if workspace needs to be kept loaded
        if (workspace.services.includes(KEEP_WS_LOADED_USID)) {
          // Get services for workspace
          const serviceIDs = new Set(
            workspace.services.filter(i => i !== KEEP_WS_LOADED_USID),
          );
          const wsServices = filteredServices.filter(service =>
            serviceIDs.has(service.id),
          );

          displayedServices = [...displayedServices, ...wsServices];
        }
      }

      // Make sure every service is in the list only once
      displayedServices = displayedServices.filter(
        (v, i, a) => a.indexOf(v) === i,
      );
    }

    return displayedServices;
  }

  @computed get filtered() {
    return this.all.filter(service =>
      service.name.toLowerCase().includes(this.filterNeedle.toLowerCase()),
    );
  }

  @computed get active() {
    return this.all.find(service => service.isActive);
  }

  @computed get activeSettings() {
    const match = matchRoute(
      '/settings/services/edit/:id',
      this.stores.router.location.pathname,
    );
    if (match) {
      const activeService = this.one(match.id);
      if (activeService) {
        return activeService;
      }

      debug('Service not available');
    }

    return null;
  }

  @computed get isTodosServiceAdded() {
    return (
      this.allDisplayed.find(
        service => service.isTodosService && service.isEnabled,
      ) || false
    );
  }

  @computed get isTodosServiceActive() {
    return this.active && this.active.isTodosService;
  }

  one(id) {
    return this.all.find(service => service.id === id);
  }

  async _showAddServiceInterface({ recipeId }) {
    this.stores.router.push(`/settings/services/add/${recipeId}`);
  }

  // Actions
  async _createService({
    recipeId,
    serviceData,
    redirect = true,
    skipCleanup = false,
  }) {
    if (!this.stores.recipes.isInstalled(recipeId)) {
      debug(`Recipe "${recipeId}" is not installed, installing recipe`);
      await this.stores.recipes._install({ recipeId });
      debug(`Recipe "${recipeId}" installed`);
    }

    // set default values for serviceData
    // eslint-disable-next-line prefer-object-spread
    // TODO: How is this different from the defaults of the recipe in 'src/models/Recipe' file?
    serviceData = {
      isEnabled: true,
      isHibernationEnabled: false,
      isNotificationEnabled: true,
      isBadgeEnabled: true,
      isMuted: false,
      customIcon: false,
      isDarkModeEnabled: false,
      spellcheckerLanguage:
        SPELLCHECKER_LOCALES[this.stores.settings.app.spellcheckerLanguage],
      userAgentPref: '',
      ...serviceData,
    };

    const data = skipCleanup
      ? serviceData
      : this._cleanUpTeamIdAndCustomUrl(recipeId, serviceData);

    const response = await this.createServiceRequest.execute(recipeId, data)
      ._promise;

    this.allServicesRequest.patch(result => {
      if (!result) return;
      result.push(response.data);
    });

    this.actions.settings.update({
      type: 'proxy',
      data: {
        [`${response.data.id}`]: data.proxy,
      },
    });

    this.actionStatus = response.status || [];

    if (redirect) {
      this.stores.router.push('/settings/recipes');
    }
  }

  @action async _createFromLegacyService({ data }) {
    const { id } = data.recipe;
    const serviceData = {};

    if (data.name) {
      serviceData.name = data.name;
    }

    if (data.team) {
      if (!data.customURL) {
        serviceData.team = data.team;
      } else {
        // TODO: Is this correct?
        serviceData.customUrl = data.team;
      }
    }

    this.actions.service.createService({
      recipeId: id,
      serviceData,
      redirect: false,
    });
  }

  @action async _updateService({ serviceId, serviceData, redirect = true }) {
    const service = this.one(serviceId);
    const data = this._cleanUpTeamIdAndCustomUrl(
      service.recipe.id,
      serviceData,
    );
    const request = this.updateServiceRequest.execute(serviceId, data);

    const newData = serviceData;
    if (serviceData.iconFile) {
      await request._promise;

      newData.iconUrl = request.result.data.iconUrl;
      newData.hasCustomUploadedIcon = true;
    }

    this.allServicesRequest.patch(result => {
      if (!result) return;

      // patch custom icon deletion
      if (data.customIcon === 'delete') {
        newData.iconUrl = '';
        newData.hasCustomUploadedIcon = false;
      }

      // patch custom icon url
      if (data.customIconUrl) {
        newData.iconUrl = data.customIconUrl;
      }

      Object.assign(
        result.find(c => c.id === serviceId),
        newData,
      );
    });

    await request._promise;
    this.actionStatus = request.result.status;

    if (service.isEnabled) {
      this._sendIPCMessage({
        serviceId,
        channel: 'service-settings-update',
        args: newData,
      });
    }

    this.actions.settings.update({
      type: 'proxy',
      data: {
        [`${serviceId}`]: data.proxy,
      },
    });

    if (redirect) {
      this.stores.router.push('/settings/services');
    }
  }

  @action async _deleteService({ serviceId, redirect }) {
    const request = this.deleteServiceRequest.execute(serviceId);

    if (redirect) {
      this.stores.router.push(redirect);
    }

    this.allServicesRequest.patch(result => {
      remove(result, c => c.id === serviceId);
    });

    await request._promise;
    this.actionStatus = request.result.status;
  }

  @action async _openRecipeFile({ recipe, file }) {
    // Get directory for recipe
    const normalDirectory = getRecipeDirectory(recipe);
    const devDirectory = getDevRecipeDirectory(recipe);
    let directory;

    if (pathExistsSync(normalDirectory)) {
      directory = normalDirectory;
    } else if (pathExistsSync(devDirectory)) {
      directory = devDirectory;
    } else {
      // Recipe cannot be found on drive
      return;
    }

    // Create and open file
    const filePath = join(directory, file);
    if (file === 'user.js') {
      if (!pathExistsSync(filePath)) {
        writeFileSync(
          filePath,
          `module.exports = (config, Ferdi) => {
  // Write your scripts here
  console.log("Hello, World!", config);
};
`,
        );
      }
    } else {
      ensureFileSync(filePath);
    }
    shell.showItemInFolder(filePath);
  }

  @action async _clearCache({ serviceId }) {
    this.clearCacheRequest.reset();
    const request = this.clearCacheRequest.execute(serviceId);
    await request._promise;
  }

  @action _setActive({ serviceId, keepActiveRoute = null }) {
    if (!keepActiveRoute) this.stores.router.push('/');
    const service = this.one(serviceId);

    for (const s of this.all) {
      s.isActive = false;
    }
    service.isActive = true;
    this._awake({ serviceId: service.id });

    if (
      this.isTodosServiceActive &&
      !this.stores.todos.settings.isFeatureEnabledByUser
    ) {
      this.actions.todos.toggleTodosFeatureVisibility();
    }

    // Update list of last used services
    this.lastUsedServices = this.lastUsedServices.filter(
      id => id !== serviceId,
    );
    this.lastUsedServices.unshift(serviceId);

    this._focusActiveService();
  }

  @action _blurActive() {
    const service = this.active;
    if (service) {
      service.isActive = false;
    } else {
      debug('No service is active');
    }
  }

  @action _setActiveNext() {
    const nextIndex = this._wrapIndex(
      this.allDisplayed.findIndex(service => service.isActive),
      1,
      this.allDisplayed.length,
    );

    for (const s of this.all) {
      s.isActive = false;
    }
    this.allDisplayed[nextIndex].isActive = true;
  }

  @action _setActivePrev() {
    const prevIndex = this._wrapIndex(
      this.allDisplayed.findIndex(service => service.isActive),
      -1,
      this.allDisplayed.length,
    );

    for (const s of this.all) {
      s.isActive = false;
    }
    this.allDisplayed[prevIndex].isActive = true;
  }

  @action _setUnreadMessageCount({ serviceId, count }) {
    const service = this.one(serviceId);

    service.unreadDirectMessageCount = count.direct;
    service.unreadIndirectMessageCount = count.indirect;
  }

  @action _setWebviewReference({ serviceId, webview }) {
    const service = this.one(serviceId);

    service.webview = webview;

    if (!service.isAttached) {
      debug('Webview is not attached, initializing');
      service.initializeWebViewEvents({
        handleIPCMessage: this.actions.service.handleIPCMessage,
        openWindow: this.actions.service.openWindow,
        stores: this.stores,
      });
      service.initializeWebViewListener();
    }

    service.isAttached = true;
  }

  @action _detachService({ service }) {
    service.webview = null;
    service.isAttached = false;
  }

  @action _focusService({ serviceId }) {
    const service = this.one(serviceId);

    if (service.webview) {
      service.webview.blur();
      service.webview.focus();
    }
  }

  @action _focusActiveService(focusEvent = null) {
    if (this.stores.user.isLoggedIn) {
      // TODO: add checks to not focus service when router path is /settings or /auth
      const service = this.active;
      if (service) {
        this._focusService({ serviceId: service.id });
        if (this.stores.settings.app.splitMode && !focusEvent) {
          setTimeout(() => {
            document.querySelector('.services__webview-wrapper.is-active').scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
          }, 10);
        }
      } else {
        debug('No service is active');
      }
    } else {
      this.allServicesRequest.invalidate();
    }
  }

  @action _toggleService({ serviceId }) {
    const service = this.one(serviceId);

    service.isEnabled = !service.isEnabled;
  }

  @action _handleIPCMessage({ serviceId, channel, args }) {
    const service = this.one(serviceId);

    // eslint-disable-next-line default-case
    switch (channel) {
      case 'hello': {
        debug('Received hello event from', serviceId);

        this._initRecipePolling(service.id);
        this._initializeServiceRecipeInWebview(serviceId);
        this._shareSettingsWithServiceProcess();

        break;
      }
      case 'alive': {
        service.lastPollAnswer = Date.now();

        break;
      }
      case 'message-counts': {
        debug(`Received unread message info from '${serviceId}'`, args[0]);

        this.actions.service.setUnreadMessageCount({
          serviceId,
          count: {
            direct: args[0].direct,
            indirect: args[0].indirect,
          },
        });

        break;
      }
      case 'notification': {
        const { options } = args[0];

        // Check if we are in scheduled Do-not-Disturb time
        const { scheduledDNDEnabled, scheduledDNDStart, scheduledDNDEnd } =
          this.stores.settings.all.app;

        if (
          scheduledDNDEnabled &&
          isInTimeframe(scheduledDNDStart, scheduledDNDEnd)
        ) {
          return;
        }

        if (
          service.recipe.hasNotificationSound ||
          service.isMuted ||
          this.stores.settings.all.app.isAppMuted
        ) {
          Object.assign(options, {
            silent: true,
          });
        }

        if (service.isNotificationEnabled) {
          let title = `Notification from ${service.name}`;
          if (!this.stores.settings.all.app.privateNotifications) {
            options.body = typeof options.body === 'string' ? options.body : '';
            title =
              typeof args[0].title === 'string' ? args[0].title : service.name;
          } else {
            // Remove message data from notification in private mode
            options.body = '';
            options.icon = '/assets/img/notification-badge.gif';
          }

          console.log(title, options);

          this.actions.app.notify({
            notificationId: args[0].notificationId,
            title,
            options,
            serviceId,
          });
        }

        break;
      }
      case 'avatar': {
        const url = args[0];
        if (service.iconUrl !== url && !service.hasCustomUploadedIcon) {
          service.customIconUrl = url;

          this.actions.service.updateService({
            serviceId,
            serviceData: {
              customIconUrl: url,
            },
            redirect: false,
          });
        }

        break;
      }
      case 'new-window': {
        const url = args[0];

        this.actions.app.openExternalUrl({ url });

        break;
      }
      case 'set-service-spellchecker-language': {
        if (!args) {
          console.warn('Did not receive locale');
        } else {
          this.actions.service.updateService({
            serviceId,
            serviceData: {
              spellcheckerLanguage: args[0] === 'reset' ? '' : args[0],
            },
            redirect: false,
          });
        }

        break;
      }
      case 'feature:todos': {
        Object.assign(args[0].data, { serviceId });
        this.actions.todos.handleHostMessage(args[0]);

        break;
      }
      // No default
    }
  }

  @action _sendIPCMessage({ serviceId, channel, args }) {
    const service = this.one(serviceId);

    // Make sure the args are clean, otherwise ElectronJS can't transmit them
    const cleanArgs = JSON.parse(JSON.stringify(args));

    if (service.webview) {
      service.webview.send(channel, cleanArgs);
    }
  }

  @action _sendIPCMessageToAllServices({ channel, args }) {
    for (const s of this.all) {
      this.actions.service.sendIPCMessage({
        serviceId: s.id,
        channel,
        args,
      });
    }
  }

  @action _openWindow({ event }) {
    if (event.url !== 'about:blank') {
      event.preventDefault();
      this.actions.app.openExternalUrl({ url: event.url });
    }
  }

  @action _filter({ needle }) {
    this.filterNeedle = needle;
  }

  @action _resetFilter() {
    this.filterNeedle = null;
  }

  @action _resetStatus() {
    this.actionStatus = [];
  }

  @action _reload({ serviceId }) {
    const service = this.one(serviceId);
    if (!service.isEnabled) return;

    service.resetMessageCount();
    service.lostRecipeConnection = false;

    if (service.isTodosService) {
      return this.actions.todos.reload();
    }

    return service.webview.loadURL(service.url);
  }

  @action _reloadActive() {
    const service = this.active;
    if (service) {
      this._reload({
        serviceId: service.id,
      });
    } else {
      debug('No service is active');
    }
  }

  @action _reloadAll() {
    for (const s of this.enabled) {
      this._reload({
        serviceId: s.id,
      });
    }
  }

  @action _reloadUpdatedServices() {
    this._reloadAll();
    this.actions.ui.toggleServiceUpdatedInfoBar({ visible: false });
  }

  @action _reorder(params) {
    const { workspaces } = this.stores;
    if (workspaces.isAnyWorkspaceActive) {
      workspaces.reorderServicesOfActiveWorkspace(params);
    } else {
      this._reorderService(params);
    }
  }

  @action _reorderService({ oldIndex, newIndex }) {
    const { showDisabledServices } = this.stores.settings.all.app;
    const oldEnabledSortIndex = showDisabledServices
      ? oldIndex
      : this.all.indexOf(this.enabled[oldIndex]);
    const newEnabledSortIndex = showDisabledServices
      ? newIndex
      : this.all.indexOf(this.enabled[newIndex]);

    this.all.splice(
      newEnabledSortIndex,
      0,
      this.all.splice(oldEnabledSortIndex, 1)[0],
    );

    const services = {};
    // TODO: simplify this
    for (const [index] of this.all.entries()) {
      services[this.all[index].id] = index;
    }

    this.reorderServicesRequest.execute(services);
    this.allServicesRequest.patch(data => {
      for (const s of data) {
        const service = s;

        service.order = services[s.id];
      }
    });
  }

  @action _toggleNotifications({ serviceId }) {
    const service = this.one(serviceId);

    this.actions.service.updateService({
      serviceId,
      serviceData: {
        isNotificationEnabled: !service.isNotificationEnabled,
      },
      redirect: false,
    });
  }

  @action _toggleAudio({ serviceId }) {
    const service = this.one(serviceId);

    this.actions.service.updateService({
      serviceId,
      serviceData: {
        isMuted: !service.isMuted,
      },
      redirect: false,
    });
  }

  @action _toggleDarkMode({ serviceId }) {
    const service = this.one(serviceId);

    this.actions.service.updateService({
      serviceId,
      serviceData: {
        isDarkModeEnabled: !service.isDarkModeEnabled,
      },
      redirect: false,
    });
  }

  @action _openDevTools({ serviceId }) {
    const service = this.one(serviceId);
    if (service.isTodosService) {
      this.actions.todos.openDevTools();
    } else {
      service.webview.openDevTools();
    }
  }

  @action _openDevToolsForActiveService() {
    const service = this.active;

    if (service) {
      this._openDevTools({ serviceId: service.id });
    } else {
      debug('No service is active');
    }
  }

  @action _hibernate({ serviceId }) {
    const service = this.one(serviceId);
    if (!service.canHibernate) {
      return;
    }
    if (service.isActive) {
      debug(`Skipping service hibernation for ${service.name}`);
      return;
    }

    debug(`Hibernate ${service.name}`);

    service.isHibernationRequested = true;
    service.lastHibernated = Date.now();
  }

  @action _awake({ serviceId }) {
    const service = this.one(serviceId);
    debug(`Waking up from service hibernation for ${service.name}`);
    service.isHibernationRequested = false;
    service.lastUsed = Date.now();
    service.lastHibernated = null;
  }

  @action _resetLastPollTimer({ serviceId = null }) {
    debug(
      `Reset last poll timer for ${
        serviceId ? `service: "${serviceId}"` : 'all services'
      }`,
    );

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const resetTimer = service => {
      service.lastPollAnswer = Date.now();
      service.lastPoll = Date.now();
    };

    if (!serviceId) {
      for (const service of this.allDisplayed) resetTimer(service);
    } else {
      const service = this.one(serviceId);
      if (service) {
        resetTimer(service);
      }
    }
  }

  // Reactions
  _focusServiceReaction() {
    const service = this.active;
    if (service) {
      this.actions.service.focusService({ serviceId: service.id });
      document.title = `Ferdi - ${service.name}`;
    } else {
      debug('No service is active');
    }
  }

  _saveActiveService() {
    const service = this.active;
    if (service) {
      this.actions.settings.update({
        type: 'service',
        data: {
          activeService: service.id,
        },
      });
    } else {
      debug('No service is active');
    }
  }

  _mapActiveServiceToServiceModelReaction() {
    const { activeService } = this.stores.settings.all.service;
    if (this.allDisplayed.length > 0) {
      this.allDisplayed.map(service =>
        Object.assign(service, {
          isActive: activeService
            ? activeService === service.id
            : this.allDisplayed[0].id === service.id,
        }),
      );
    }
  }

  _getUnreadMessageCountReaction() {
    const { showMessageBadgeWhenMuted } = this.stores.settings.all.app;
    const { showMessageBadgesEvenWhenMuted } = this.stores.ui;

    const unreadDirectMessageCount = this.allDisplayed
      .filter(
        s =>
          (showMessageBadgeWhenMuted || s.isNotificationEnabled) &&
          showMessageBadgesEvenWhenMuted &&
          s.isBadgeEnabled,
      )
      .map(s => s.unreadDirectMessageCount)
      .reduce((a, b) => a + b, 0);

    const unreadIndirectMessageCount = this.allDisplayed
      .filter(
        s =>
          showMessageBadgeWhenMuted &&
          showMessageBadgesEvenWhenMuted &&
          s.isBadgeEnabled &&
          s.isIndirectMessageBadgeEnabled,
      )
      .map(s => s.unreadIndirectMessageCount)
      .reduce((a, b) => a + b, 0);

    // We can't just block this earlier, otherwise the mobx reaction won't be aware of the vars to watch in some cases
    if (showMessageBadgesEvenWhenMuted) {
      this.actions.app.setBadge({
        unreadDirectMessageCount,
        unreadIndirectMessageCount,
      });
    }
  }

  _logoutReaction() {
    if (!this.stores.user.isLoggedIn) {
      this.actions.settings.remove({
        type: 'service',
        key: 'activeService',
      });
      this.allServicesRequest.invalidate().reset();
    }
  }

  _handleMuteSettings() {
    const { enabled } = this;
    const { isAppMuted } = this.stores.settings.app;

    for (const service of enabled) {
      const { isAttached } = service;
      const isMuted = isAppMuted || service.isMuted;

      if (isAttached) {
        service.webview.audioMuted = isMuted;
      }
    }
  }

  _shareSettingsWithServiceProcess() {
    const settings = {
      ...this.stores.settings.app,
      isDarkThemeActive: this.stores.ui.isDarkThemeActive,
    };
    this.actions.service.sendIPCMessageToAllServices({
      channel: 'settings-update',
      args: settings,
    });
  }

  _cleanUpTeamIdAndCustomUrl(recipeId, data) {
    const serviceData = data;
    const recipe = this.stores.recipes.one(recipeId);

    if (!recipe) return;

    if (
      recipe.hasTeamId &&
      recipe.hasCustomUrl &&
      data.team &&
      data.customUrl
    ) {
      delete serviceData.team;
    }

    return serviceData;
  }

  _checkForActiveService() {
    if (
      !this.stores.router.location ||
      this.stores.router.location.pathname.includes('auth/signup')
    ) {
      return;
    }

    if (
      this.allDisplayed.findIndex(service => service.isActive) === -1 &&
      this.allDisplayed.length > 0
    ) {
      debug('No active service found, setting active service to index 0');

      this._setActive({ serviceId: this.allDisplayed[0].id });
    }
  }

  // Helper
  _initializeServiceRecipeInWebview(serviceId) {
    const service = this.one(serviceId);

    if (service.webview) {
      // We need to completely clone the object, otherwise Electron won't be able to send the object via IPC
      const shareWithWebview = JSON.parse(
        JSON.stringify(service.shareWithWebview),
      );

      debug('Initialize recipe', service.recipe.id, service.name);
      service.webview.send(
        'initialize-recipe',
        {
          ...shareWithWebview,
          franzVersion: ferdiVersion,
        },
        service.recipe,
      );
    }
  }

  _initRecipePolling(serviceId) {
    const service = this.one(serviceId);

    const delay = ms('2s');

    if (service) {
      if (service.timer !== null) {
        clearTimeout(service.timer);
      }

      const loop = () => {
        if (!service.webview) return;

        service.webview.send('poll');

        service.timer = setTimeout(loop, delay);
        service.lastPoll = Date.now();
      };

      loop();
    }
  }

  _wrapIndex(index, delta, size) {
    return (((index + delta) % size) + size) % size;
  }
}
