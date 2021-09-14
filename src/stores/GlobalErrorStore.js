import { observable, action } from 'mobx';
import Store from './lib/Store';
import Request from './lib/Request';

export default class GlobalErrorStore extends Store {
  @observable error = null;

  @observable messages = [];

  @observable response = {};

  constructor(...args) {
    super(...args);

    window.addEventListener('error', (...errorArgs) => {
      this._handleConsoleError.call(this, ['error', ...errorArgs]);
    });

    const origConsoleError = console.error;
    window.console.error = (...errorArgs) => {
      this._handleConsoleError.call(this, ['error', ...errorArgs]);
      origConsoleError.apply(this, errorArgs);
    };

    const origConsoleLog = console.log;
    window.console.log = (...logArgs) => {
      this._handleConsoleError.call(this, ['log', ...logArgs]);
      origConsoleLog.apply(this, logArgs);
    };

    const origConsoleInfo = console.info;
    window.console.info = (...infoArgs) => {
      this._handleConsoleError.call(this, ['info', ...infoArgs]);
      origConsoleInfo.apply(this, infoArgs);
    };

    Request.registerHook(this._handleRequests);
  }

  _handleConsoleError(type, error, url, line) {
    if (typeof type === 'object' && type.length > 0) {
      this.messages.push({
        type: type[0],
        info: type,
      });
    } else {
      this.messages.push({
        type,
        error,
        url,
        line,
      });
    }
  }

  _handleRequests = action(async request => {
    if (request.isError) {
      this.error = request.error;

      if (request.error.json) {
        try {
          this.response = await request.error.json();
        } catch {
          this.response = {};
        }
        if (this.error.status === 401) {
          window.ferdi.stores.app.authRequestFailed = true;
          // this.actions.user.logout({ serverLogout: true });
        }
      }

      this.messages.push({
        type: 'error',
        request: {
          result: request.result,
          wasExecuted: request.wasExecuted,
          method: request._method,
        },
        error: this.error,
        response: this.response,
        server: window.ferdi.stores.settings.app.server,
      });
    } else {
      window.ferdi.stores.app.authRequestFailed = false;
    }
  });
}
