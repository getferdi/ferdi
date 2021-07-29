export default class ActionBinding {
  action;

  isActive = false;

  constructor(action) {
    this.action = action;
  }

  start() {
    if (!this.isActive) {
      const { action } = this;
      action[0].listen(action[1]);
      this.isActive = true;
    }
  }

  stop() {
    if (this.isActive) {
      const { action } = this;
      action[0].off(action[1]);
      this.isActive = false;
    }
  }
}

export const createActionBindings = (actions) => (
  actions.map((a) => new ActionBinding(a))
);
