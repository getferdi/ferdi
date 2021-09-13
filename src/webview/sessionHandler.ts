import { getCurrentWebContents } from '@electron/remote';

const debug = require('debug')('Ferdi:Plugin:SessionHandler');

export class SessionHandler {
  clearStorageData(storageLocations: string[]) {
    try {
      debug('Clearing storageLocations:', storageLocations);
      const { session } = getCurrentWebContents();
      session.flushStorageData();
      session.clearStorageData({ storages: storageLocations });
    } catch (err) {
      debug(err);
    }
  }

  async releaseServiceWorkers() {
    try {
      const registrations = await window.navigator.serviceWorker.getRegistrations();
      registrations.forEach(r => {
        r.unregister();
        debug('ServiceWorker unregistered');
      });
    } catch (err) {
      debug(err);
    }
  }
}
