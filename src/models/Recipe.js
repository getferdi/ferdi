import semver from 'semver';
import { pathExistsSync } from 'fs-extra';
import { join } from 'path';

export default class Recipe {
  // Note: Do NOT change these default values. If they change, then the corresponding changes in the recipes needs to be done
  id = '';

  name = '';

  description = '';

  version = '';

  aliases = [];

  path = '';

  serviceURL = '';

  hasDirectMessages = true;

  hasIndirectMessages = false;

  hasNotificationSound = false;

  hasTeamId = false;

  hasCustomUrl = false;

  hasHostedOption = false;

  urlInputPrefix = '';

  urlInputSuffix = '';

  message = '';

  disablewebsecurity = false;

  autoHibernate = false;

  partition = '';

  constructor(data) {
    if (!data) {
      throw Error('Recipe config not valid');
    }

    if (!data.id) {
      // Ferdi 4 recipes do not have an Id
      throw Error(`Recipe '${data.name}' requires Id`);
    }

    try {
      if (!semver.valid(data.version)) {
        throw Error(`Version ${data.version} of recipe '${data.name}' is not a valid semver version`);
      }
    } catch (e) {
      console.warn(e.message);
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.version = data.version || this.version;
    this.aliases = data.aliases || this.aliases;
    this.path = data.path;

    this.serviceURL = data.config.serviceURL || this.serviceURL;

    this.hasDirectMessages = data.config.hasDirectMessages || this.hasDirectMessages;
    this.hasIndirectMessages = data.config.hasIndirectMessages || this.hasIndirectMessages;
    this.hasNotificationSound = data.config.hasNotificationSound || this.hasNotificationSound;
    this.hasTeamId = data.config.hasTeamId || this.hasTeamId;
    this.hasCustomUrl = data.config.hasCustomUrl || this.hasCustomUrl;
    this.hasHostedOption = data.config.hasHostedOption || this.hasHostedOption;

    this.urlInputPrefix = data.config.urlInputPrefix || this.urlInputPrefix;
    this.urlInputSuffix = data.config.urlInputSuffix || this.urlInputSuffix;

    this.disablewebsecurity = data.config.disablewebsecurity || this.disablewebsecurity;

    this.autoHibernate = data.config.autoHibernate || this.autoHibernate;

    this.partition = data.config.partition || this.partition;

    this.message = data.config.message || this.message;
  }

  // TODO: Need to remove this if its not used anywhere
  get author() {
    return [];
  }

  get hasDarkMode() {
    return pathExistsSync(join(this.path, 'darkmode.css'));
  }
}
