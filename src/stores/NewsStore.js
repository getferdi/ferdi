import { computed, observable } from 'mobx';
import { remove } from 'lodash';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';
import { CHECK_INTERVAL } from '../config';

export default class NewsStore extends Store {
  @observable latestNewsRequest = new CachedRequest(this.api.news, 'latest');

  @observable hideNewsRequest = new Request(this.api.news, 'hide');

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.news.hide.listen(this._hide.bind(this));
    this.actions.user.logout.listen(this._resetNewsRequest.bind(this));
  }

  setup() {
    // Check for news updates every couple of hours
    setInterval(() => {
      if (this.latestNewsRequest.wasExecuted && this.stores.user.isLoggedIn) {
        this.latestNewsRequest.invalidate({ immediately: true });
      }
    }, CHECK_INTERVAL);
  }

  @computed get latest() {
    return this.latestNewsRequest.execute().result || [];
  }

  // Actions
  _hide({ newsId }) {
    this.hideNewsRequest.execute(newsId);

    this.latestNewsRequest.invalidate().patch((result) => {
      // TODO: check if we can use mobx.array remove
      remove(result, (n) => n.id === newsId);
    });
  }

  /**
   * Reset the news request when current user logs out so that when another user
   * logs in again without an app restart, the request will be fetched again and
   * the news will be shown to the user.
   *
   * @private
   */
  _resetNewsRequest() {
    this.latestNewsRequest.reset();
  }
}
