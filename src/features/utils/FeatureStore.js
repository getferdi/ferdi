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
    actions.forEach((a) => a.start());
  }

  _stopActions(actions = this._actions) {
    actions.forEach((a) => a.stop());
  }

  // REACTIONS

  _registerReactions(reactions) {
    this._reactions = reactions;
    this._startReactions();
  }

  _startReactions(reactions = this._reactions) {
    reactions.forEach((r) => r.start());
  }

  _stopReactions(reactions = this._reactions) {
    reactions.forEach((r) => r.stop());
  }
}
