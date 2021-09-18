export class FeatureStore {
  _actions = [];

  _reactions = [];

  stop() {
    this._stopActions();
    this._stopReactions();
  }

  // ACTIONS

  _registerActions(actions) {
    this._actions = actions;
    this._startActions();
  }

  _startActions(actions = this._actions) {
    for (const a of actions) a.start();
  }

  _stopActions(actions = this._actions) {
    for (const a of actions) a.stop();
  }

  // REACTIONS

  _registerReactions(reactions) {
    this._reactions = reactions;
    this._startReactions();
  }

  _startReactions(reactions = this._reactions) {
    for (const r of reactions) r.start();
  }

  _stopReactions(reactions = this._reactions) {
    for (const r of reactions) r.stop();
  }
}
