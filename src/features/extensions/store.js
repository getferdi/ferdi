import {
  action,
  observable,
} from 'mobx';

import extensionsActions from './actions';
import { FeatureStore } from '../utils/FeatureStore';
import { createReactions } from '../../stores/lib/Reaction';
import { createActionBindings } from '../utils/ActionBinding';

const debug = require('debug')('Ferdi:feature:extensions:store');

export default class ExtensionsStore extends FeatureStore {
  @observable active = [];

  @observable infos = {};

  @observable browserActions = [];

  @observable webViews = [];

  @action start(stores, actions) {
    debug('Starting, registering actions and reactions');
    this.stores = stores;
    this.actions = actions;

    // ACTIONS

    this._registerActions(createActionBindings([
      [extensionsActions.activate, this._activate],
      [extensionsActions.addAction, this._addAction],
      [extensionsActions.addWebView, this._addWebView],
      [extensionsActions.addInfo, this._addInfo],
    ]));

    // REACTIONS

    this._allReactions = createReactions([
    ]);
  }

  @action stop() {
    super.stop();
    debug('Stopping and resetting');
    this.reset();
    this.isFeatureActive = false;
  }

  // Actions

  @action _activate = ({ id }) => {
    this.active.push(id);
  };

  @action _addAction = ({ action: act }) => {
    this.browserActions.push(act);
  };

  @action _addWebView = ({ view }) => {
    this.webViews.push(view);
  };

  @action _addInfo = ({ id, info }) => {
    this.infos[id] = info;
  };
}
