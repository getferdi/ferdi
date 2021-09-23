import semver from 'semver';
import { pathExistsSync } from 'fs-extra';
import { join } from 'path';
import {
  ifUndefinedString,
  ifUndefinedBoolean,
} from '../jsUtils';

interface IRecipe {
  id: string;
  name: string;
  version: string;
  aliases?: string[];
  path: string;
  config: {
    serviceURL?: string;
    hasDirectMessages?: boolean;
    hasIndirectMessages?: boolean;
    hasNotificationSound?: boolean;
    hasTeamId?: boolean;
    hasCustomUrl?: boolean;
    hasHostedOption?: boolean;
    urlInputPrefix?: string;
    urlInputSuffix?: string;
    disablewebsecurity?: boolean;
    autoHibernate?: boolean;
    partition?: string;
    message?: string;
    allowFavoritesDelineationInUnreadCount?: boolean;
  };
}

export default class Recipe {
  // Note: Do NOT change these default values. If they change, then the corresponding changes in the recipes needs to be done
  id: string = '';

  name: string = '';

  description = '';

  version: string = '';

  aliases: string[] = [];

  path: string = '';

  serviceURL: string = '';

  hasDirectMessages: boolean = true;

  hasIndirectMessages: boolean = false;

  hasNotificationSound: boolean = false;

  hasTeamId: boolean = false;

  hasCustomUrl: boolean = false;

  hasHostedOption: boolean = false;

  urlInputPrefix: string = '';

  urlInputSuffix: string = '';

  message: string = '';

  allowFavoritesDelineationInUnreadCount: boolean = false;

  disablewebsecurity: boolean = false;

  autoHibernate: boolean = false;

  partition: string = '';

  // TODO: Need to reconcile which of these are optional/mandatory
  constructor(data: IRecipe) {
    if (!data) {
      throw new Error('Recipe config not valid');
    }

    if (!data.id) {
      // Ferdi 4 recipes do not have an Id
      throw new Error(`Recipe '${data.name}' requires Id`);
    }

    if (!semver.valid(data.version)) {
      throw new Error(`Version ${data.version} of recipe '${data.name}' is not a valid semver version`);
    }

    this.id = data.id || this.id;
    this.name = ifUndefinedString(data.name, this.name);
    this.version = ifUndefinedString(data.version, this.version);
    this.aliases = data.aliases || this.aliases;
    this.path = data.path;

    this.serviceURL = ifUndefinedString(data.config.serviceURL, this.serviceURL);

    this.hasDirectMessages = ifUndefinedBoolean(data.config.hasDirectMessages, this.hasDirectMessages);
    this.hasIndirectMessages = ifUndefinedBoolean(data.config.hasIndirectMessages, this.hasIndirectMessages);
    this.hasNotificationSound = ifUndefinedBoolean(data.config.hasNotificationSound, this.hasNotificationSound);
    this.hasTeamId = ifUndefinedBoolean(data.config.hasTeamId, this.hasTeamId);
    this.hasCustomUrl = ifUndefinedBoolean(data.config.hasCustomUrl, this.hasCustomUrl);
    this.hasHostedOption = ifUndefinedBoolean(data.config.hasHostedOption, this.hasHostedOption);

    this.urlInputPrefix = ifUndefinedString(data.config.urlInputPrefix, this.urlInputPrefix);
    this.urlInputSuffix = ifUndefinedString(data.config.urlInputSuffix, this.urlInputSuffix);

    this.disablewebsecurity = data.config.disablewebsecurity || this.disablewebsecurity;

    this.autoHibernate = data.config.autoHibernate || this.autoHibernate;

    this.partition = ifUndefinedString(data.config.partition, this.partition);

    this.message = ifUndefinedString(data.config.message, this.message);
    this.allowFavoritesDelineationInUnreadCount = ifUndefinedBoolean(data.config.allowFavoritesDelineationInUnreadCount, this.allowFavoritesDelineationInUnreadCount);
  }

  // TODO: Need to remove this if its not used anywhere
  get author(): string[] {
    return [];
  }

  get hasDarkMode(): boolean {
    return pathExistsSync(join(this.path, 'darkmode.css'));
  }
}
