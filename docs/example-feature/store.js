import { action, observable, reaction } from 'mobx';
import Store from '../../src/stores/lib/Store';
import Request from '../../src/stores/lib/Request';

const debug = require('debug')('Ferdi:feature:EXAMPLE_FEATURE:store');

export class ExampleFeatureStore extends Store {
  @observable getNameRequest = new Request(this.api, 'getName');

  constructor(stores, api, actions, state) {
    super(stores, api, actions);
    this.state = state;
  }

  setup() {
    debug('fetching name from api');
    this.getNameRequest.execute();

    // Update the name on the state when the request resolved
    reaction(
      () => (
        this.getNameRequest.result
      ),
      (name) => {
        this._setName(name);
      },
    );
  }

  @action _setName = (name) => {
    debug('setting name', name);
    this.state.name = name;
  };
}

export default ExampleFeatureStore;
