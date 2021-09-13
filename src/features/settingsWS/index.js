import { reaction } from 'mobx';
import { SettingsWSStore } from './store';

const debug = require('debug')('Ferdi:feature:settingsWS');

export const settingsStore = new SettingsWSStore();

export default function initSettingsWebSocket(stores, actions) {
  const { features } = stores;

  // Toggle SettingsWebSocket feature
  reaction(
    () => (
      features.features.isSettingsWSEnabled
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `settingsWS` feature');
        settingsStore.start(stores, actions);
      } else if (settingsStore) {
        debug('Disabling `settingsWS` feature');
        settingsStore.stop();
      }
    },
    { fireImmediately: true },
  );
}
