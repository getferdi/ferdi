import { ipcRenderer } from 'electron';
import { BrowserWindow } from '@electron/remote';
import { pathExistsSync, readFileSync, existsSync } from 'fs-extra';

const debug = require('debug')('Ferdi:Plugin:RecipeWebview');

class RecipeWebview {
  constructor(badgeHandler, notificationsHandler, sessionHandler) {
    this.badgeHandler = badgeHandler;
    this.notificationsHandler = notificationsHandler;
    this.sessionHandler = sessionHandler;

    ipcRenderer.on('poll', () => {
      this.loopFunc();

      debug('Poll event');

      // This event is for checking if the service recipe is still actively
      // communicating with the client
      ipcRenderer.sendToHost('alive');
    });
  }

  loopFunc = () => null;

  darkModeHandler = false;

  // TODO Remove this once we implement a proper wrapper.
  get ipcRenderer() {
    return ipcRenderer;
  }

  // TODO Remove this once we implement a proper wrapper.
  get BrowserWindow() {
    return BrowserWindow;
  }

  /**
   * Initialize the loop
   *
   * @param {Function}        Function that will be executed
   */
  loop(fn) {
    this.loopFunc = fn;
  }

  /**
   * Set the unread message badge
   *
   * @param {string | number | undefined | null} direct      Set the count of direct messages
   *                                                         eg. Slack direct mentions, or a
   *                                                         message to @channel
   * @param {string | number | undefined | null} indirect    Set a badge that defines there are
   *                                                         new messages but they do not involve
   *                                                         me directly to me eg. in a channel
   */
  setBadge(direct = 0, indirect = 0) {
    this.badgeHandler.setBadge(direct, indirect);
  }

  /**
   * Safely parse the given text into an integer
   *
   * @param  {string | number | undefined | null} text to be parsed
   */
  safeParseInt(text) {
    return this.badgeHandler.safeParseInt(text);
  }

  /**
   * Injects the contents of a CSS file into the current webview
   *
   * @param {Array} files     CSS files that should be injected. This must
   *                          be an absolute path to the file
   */
  injectCSS(...files) {
    // eslint-disable-next-line unicorn/no-array-for-each
    files.forEach(file => {
      if (pathExistsSync(file)) {
        const styles = document.createElement('style');
        styles.innerHTML = readFileSync(file, 'utf8');

        document.querySelector('head').append(styles);

        debug('Append styles', styles);
      }
    });
  }

  injectJSUnsafe(...files) {
    Promise.all(
      files.map(file => {
        if (existsSync(file)) {
          return readFileSync(file, 'utf8');
        }
        debug('Script not found', file);
        return null;
      }),
    ).then(scripts => {
      const scriptsFound = scripts.filter(script => script !== null);
      if (scriptsFound.length > 0) {
        debug('Inject scripts to main world', scriptsFound);
        ipcRenderer.sendToHost('inject-js-unsafe', ...scriptsFound);
      }
    });
  }

  /**
   * Set a custom handler for turning on and off dark mode
   *
   * @param {function} handler
   */
  handleDarkMode(handler) {
    this.darkModeHandler = handler;
  }

  onNotify(fn) {
    if (typeof fn === 'function') {
      this.notificationsHandler.onNotify = fn;
    }
  }

  initialize(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  }

  clearStorageData(storageLocations) {
    this.sessionHandler.clearStorageData(storageLocations);
  }

  releaseServiceWorkers() {
    this.sessionHandler.releaseServiceWorkers();
  }
}

export default RecipeWebview;
