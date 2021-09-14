import { getCurrentWebContents } from '@electron/remote';

const debug = require('debug')('Ferdi:Plugin:SessionHandler');

export class SessionHandler {
  clearStorageData(storageLocations: string[]) {
    try {
      debug('Clearing storageLocations:', storageLocations);
      const { session } = getCurrentWebContents();
      session.flushStorageData();
      session.clearStorageData({ storages: storageLocations });
    } catch (error) {
      debug(error);
    }
  }

  async releaseServiceWorkers() {
    try {
      const registrations =
        await window.navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        registration.unregister();
        debug('ServiceWorker unregistered');
      }
    } catch (error) {
      debug(error);
    }
  }
}
