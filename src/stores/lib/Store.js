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
    for (const reaction of reactions) this._reactions.push(new Reaction(reaction));
  }

  setup() {}

  initialize() {
    this.setup();
    for (const reaction of this._reactions) reaction.start();
  }

  teardown() {
    for (const reaction of this._reactions) reaction.stop();
  }

  resetStatus() {
    this._status = null;
  }
}
