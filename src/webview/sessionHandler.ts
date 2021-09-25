import { ipcRenderer } from 'electron';

const debug = require('debug')('Ferdi:Plugin:SessionHandler');

export class SessionHandler {
  clearStorageData(serviceId: string, targetsToClear: object = {}) {
    ipcRenderer.send('clear-storage-data', { serviceId, targetsToClear });
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
