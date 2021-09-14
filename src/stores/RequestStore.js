import { ipcRenderer } from 'electron';
import { action, computed, observable } from 'mobx';
import ms from 'ms';

import Store from './lib/Store';

const debug = require('debug')('Ferdi:RequestsStore');

export default class RequestStore extends Store {
  @observable userInfoRequest;

  @observable servicesRequest;

  @observable showRequiredRequestsError = false;

  @observable localServerPort = 45_569;

  retries = 0;

  retryDelay = ms('2s');

  constructor(...args) {
    super(...args);

    this.actions.requests.retryRequiredRequests.listen(
      this._retryRequiredRequests.bind(this),
    );

    this.registerReactions([this._autoRetry.bind(this)]);
  }

  setup() {
    this.userInfoRequest = this.stores.user.getUserInfoRequest;
    this.servicesRequest = this.stores.services.allServicesRequest;

    ipcRenderer.on('localServerPort', (event, data) => {
      if (data.port) {
        this.localServerPort = data.port;
      }
    });
  }

  @computed get areRequiredRequestsSuccessful() {
    return !this.userInfoRequest.isError && !this.servicesRequest.isError;
  }

  @computed get areRequiredRequestsLoading() {
    return this.userInfoRequest.isExecuting || this.servicesRequest.isExecuting;
  }

  @action _retryRequiredRequests() {
    this.userInfoRequest.reload();
    this.servicesRequest.reload();
  }

  // Reactions
  _autoRetry() {
    const delay = (this.retries <= 10 ? this.retries : 10) * this.retryDelay;
    if (!this.areRequiredRequestsSuccessful && this.stores.user.isLoggedIn) {
      setTimeout(() => {
        this.retries += 1;
        this._retryRequiredRequests();
        if (this.retries === 4) {
          this.showRequiredRequestsError = true;
        }

        this._autoRetry();
        debug(`Retry required requests delayed in ${delay / 1000}s`);
      }, delay);
    }
  }
}
