import { action, computed, observable } from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';

export default class RecipePreviewsStore extends Store {
  @observable allRecipePreviewsRequest = new CachedRequest(this.api.recipePreviews, 'all');

  @observable searchRecipePreviewsRequest = new Request(this.api.recipePreviews, 'search');

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.recipePreview.search.listen(this._search.bind(this));
  }

  @computed get all() {
    return this.allRecipePreviewsRequest.execute().result || [];
  }

  @computed get searchResults() {
    return this.searchRecipePreviewsRequest.result || [];
  }

  @computed get dev() {
    return this.stores.recipes.all.filter((r) => r.local);
  }

  // Actions
  @action _search({ needle }) {
    if (needle !== '') {
      this.searchRecipePreviewsRequest.execute(needle);
    }
  }
}
