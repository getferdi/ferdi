import { computed, observable } from 'mobx';
import Reaction from './Reaction';

export default class Store {
  stores = {};

  api = {};

  actions = {};

  _reactions = [];

  // status implementation
  @observable _status = null;

  @computed get actionStatus() {
    return this._status || [];
  }

  set actionStatus(status) {
    this._status = status;
  }

  constructor(stores, api, actions) {
    this.stores = stores;
    this.api = api;
    this.actions = actions;
  }

  registerReactions(reactions) {
    reactions.forEach((reaction) => this._reactions.push(new Reaction(reaction)));
  }

  setup() {}

  initialize() {
    this.setup();
    this._reactions.forEach((reaction) => reaction.start());
  }

  teardown() {
    this._reactions.forEach((reaction) => reaction.stop());
  }

  resetStatus() {
    this._status = null;
  }
}
