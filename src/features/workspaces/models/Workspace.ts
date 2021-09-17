import { observable } from 'mobx';

import { KEEP_WS_LOADED_USID } from '../../../config';

export default class Workspace {
  id = null;

  @observable name = null;

  @observable order = null;

  @observable services = [];

  @observable userId = null;

  constructor(data) {
    if (!data.id) {
      throw new Error('Workspace requires Id');
    }

    this.id = data.id;
    this.name = data.name;
    this.order = data.order;

    let { services } = data;
    if (data.saving && Boolean(data.keepLoaded)) {
      // Keep workspaces loaded
      services.push(KEEP_WS_LOADED_USID);
    } else if (data.saving && data.services.includes(KEEP_WS_LOADED_USID)) {
      // Don't keep loaded
      services = services.filter(e => e !== KEEP_WS_LOADED_USID);
    }

    // @ts-expect-error Property 'replace' does not exist on type 'never[]'.
    this.services.replace(services);

    this.userId = data.userId;
  }
}
