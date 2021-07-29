import { autorun } from 'mobx';

export default class Reaction {
  reaction;

  isRunning = false;

  dispose;

  constructor(reaction) {
    this.reaction = reaction;
  }

  start() {
    if (!this.isRunning) {
      this.dispose = autorun(this.reaction);
      this.isRunning = true;
    }
  }

  stop() {
    if (this.isRunning) {
      this.dispose();
      this.isRunning = false;
    }
  }
}

export const createReactions = (reactions) => (
  reactions.map((r) => new Reaction(r))
);
