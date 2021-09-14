import { observable } from 'mobx';
import WebSocket from 'ws';
import ms from 'ms';

import { FeatureStore } from '../utils/FeatureStore';
import { createReactions } from '../../stores/lib/Reaction';
import { WS_API } from '../../environment';

const debug = require('debug')('Ferdi:feature:settingsWS:store');

export class SettingsWSStore extends FeatureStore {
  stores = null;

  actions = null;

  ws = null;

  pingTimeout = null;

  reconnectTimeout = null;

  @observable connected = false;

  start(stores, actions) {
    this.stores = stores;
    this.actions = actions;

    this._registerReactions(
      createReactions([
        this._initialize.bind(this),
        this._reconnect.bind(this),
        this._close.bind(this),
      ]),
    );
  }

  connect() {
    try {
      const wsURL = `${WS_API}/ws/${this.stores.user.data.id}`;
      debug('Setting up WebSocket to', wsURL);

      this.ws = new WebSocket(wsURL);

      this.ws.on('open', () => {
        debug('Opened WebSocket');
        this.send({
          action: 'authorize',
          token: this.stores.user.authToken,
        });

        this.connected = true;

        this.heartbeat();
      });

      this.ws.on('message', data => {
        const resp = JSON.parse(data);
        debug('Received message', resp);

        if (resp.id) {
          this.stores.user.getUserInfoRequest.patch(result => {
            if (!result) return;

            debug('Patching user object with new values');
            Object.assign(result, resp);
          });
        }
      });

      this.ws.on('ping', this.heartbeat.bind(this));
    } catch (error) {
      console.error(error);
    }
  }

  heartbeat() {
    debug('Heartbeat');
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      debug('Terminating connection, reconnecting in 35');
      this.ws.terminate();

      this.connected = false;
    }, ms('35s'));
  }

  send(data) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(data));
      debug('Sending data', data);
    } else {
      debug('WebSocket is not initialized');
    }
  }

  // Reactions

  _initialize() {
    if (this.stores.user.data.id && !this.ws) {
      this.connect();
    }
  }

  _reconnect() {
    if (!this.connected) {
      debug('Trying to reconnect in 30s');
      this.reconnectTimeout = setInterval(() => {
        debug('Trying to reconnect');
        this.connect();
      }, ms('30s'));
    } else {
      debug('Clearing reconnect interval');
      clearInterval(this.reconnectTimeout);
    }
  }

  _close() {
    if (!this.stores.user.isLoggedIn) {
      debug('Stopping reactions');
      this._stopReactions();

      if (this.ws) {
        debug('Terminating connection');
        this.ws.terminate();
        this.ws = null;
      }
    }
  }
}

export default SettingsWSStore;
