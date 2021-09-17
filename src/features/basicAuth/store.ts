import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

const debug = require('debug')('Ferdi:feature:basicAuth');

const defaultState = {
  isModalVisible: true,
  service: null,
  authInfo: null,
};

export const state = observable(defaultState);

export function resetState() {
  Object.assign(state, defaultState);
}
export function sendCredentials(user, password) {
  debug('Sending credentials to main', user, password);

  ipcRenderer.send('feature-basic-auth-credentials', {
    user,
    password,
  });
}

export function cancelLogin() {
  debug('Cancel basic auth event');

  ipcRenderer.send('feature-basic-auth-cancel');
}
