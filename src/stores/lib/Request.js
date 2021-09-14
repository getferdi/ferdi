import { observable, action, computed } from 'mobx';
import { isEqual } from 'lodash/fp';

export default class Request {
  static _hooks = [];

  static registerHook(hook) {
    Request._hooks.push(hook);
  }

  @observable result = null;

  @observable error = null;

  @observable isExecuting = false;

  @observable isError = false;

  @observable wasExecuted = false;

  _promise = Promise;

  _api = {};

  _method = '';

  _isWaitingForResponse = false;

  _currentApiCall = null;

  constructor(api, method) {
    this._api = api;
    this._method = method;
  }

  execute(...callArgs) {
    // Do not continue if this request is already loading
    if (this._isWaitingForResponse) return this;

    if (!this._api[this._method]) {
      throw new Error(`Missing method <${this._method}> on api object:`, this._api);
    }

    // This timeout is necessary to avoid warnings from mobx
    // regarding triggering actions as side-effect of getters
    setTimeout(action(() => {
      this.isExecuting = true;
    }), 0);

    // Issue api call & save it as promise that is handled to update the results of the operation
    this._promise = new Promise((resolve, reject) => {
      this._api[this._method](...callArgs)
        .then((result) => {
          setTimeout(action(() => {
            this.result = result;
            if (this._currentApiCall) this._currentApiCall.result = result;
            this.isExecuting = false;
            this.isError = false;
            this.wasExecuted = true;
            this._isWaitingForResponse = false;
            this._triggerHooks();
            resolve(result);
          }), 1);
          return result;
        })
        .catch(action((error) => {
          setTimeout(action(() => {
            this.error = error;
            this.isExecuting = false;
            this.isError = true;
            this.wasExecuted = true;
            this._isWaitingForResponse = false;
            this._triggerHooks();
            reject(error);
          }), 1);
        }));
    });

    this._isWaitingForResponse = true;
    this._currentApiCall = { args: callArgs, result: null };
    return this;
  }

  reload() {
    const args = this._currentApiCall ? this._currentApiCall.args : [];
    return this.execute(...args);
  }

  retry = () => this.reload();

  isExecutingWithArgs(...args) {
    return this.isExecuting && this._currentApiCall && isEqual(this._currentApiCall.args, args);
  }

  @computed get isExecutingFirstTime() {
    return !this.wasExecuted && this.isExecuting;
  }

  then(...args) {
    if (!this._promise) throw new Error('You have to call Request::execute before you can access it as promise');
    return this._promise.then(...args);
  }

  catch(...args) {
    if (!this._promise) throw new Error('You have to call Request::execute before you can access it as promise');
    return this._promise.catch(...args);
  }

  _triggerHooks() {
    for (const hook of Request._hooks) hook(this);
  }

  reset = () => {
    this.result = null;
    this.isExecuting = false;
    this.isError = false;
    this.wasExecuted = false;
    this._isWaitingForResponse = false;
    this._promise = Promise;

    return this;
  };
}
