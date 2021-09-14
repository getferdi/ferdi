import { ipcRenderer } from 'electron';

const debug = require('debug')('Ferdi:Plugin:BadgeHandler');

export class BadgeHandler {
  countCache: { direct: number; indirect: number; };

  constructor() {
    this.countCache = {
      direct: 0,
      indirect: 0,
    };
  }

  // TODO: Need to extract this into a utility class and reuse outside of the recipes
  safeParseInt(text: string | number | undefined | null) {
    if (text === undefined || text === null) {
      return 0;
    }

    // Parse number to integer
    // This will correct errors that recipes may introduce, e.g.
    // by sending a String instead of an integer
    const parsedNumber = Number.parseInt(text.toString(), 10);
    const adjustedNumber = Number.isNaN(parsedNumber) ? 0 : parsedNumber;
    return Math.max(adjustedNumber, 0);
  }

  setBadge(direct: string | number | undefined | null, indirect: string | number | undefined | null) {
    const count = {
      direct: this.safeParseInt(direct),
      indirect: this.safeParseInt(indirect),
    };

    if (this.countCache.direct.toString() === count.direct.toString()
        && this.countCache.indirect.toString() === count.indirect.toString()) {
      return;
    }

    debug('Sending badge count to host', count);
    ipcRenderer.sendToHost('message-counts', count);

    Object.assign(this.countCache, count);
  }
}
