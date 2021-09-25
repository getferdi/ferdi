import { ipcRenderer } from 'electron';
import du from 'du';

import { getServicePartitionsDirectory } from '../../helpers/service-helpers';

const debug = require('debug')('Ferdi:LocalApi');

export default class LocalApi {
  // Settings
  getAppSettings(type: any) {
    return new Promise(resolve => {
      ipcRenderer.once('appSettings', (_event, resp) => {
        debug('LocalApi::getAppSettings resolves', resp.type, resp.data);
        resolve(resp);
      });

      ipcRenderer.send('getAppSettings', type);
    });
  }

  async updateAppSettings(type: any, data: any) {
    debug('LocalApi::updateAppSettings resolves', type, data);
    ipcRenderer.send('updateAppSettings', {
      type,
      data,
    });
  }

  // Services
  async getAppCacheSize() {
    const partitionsDir = getServicePartitionsDirectory();
    return new Promise((resolve, reject) => {
      du(partitionsDir, {}, (err: Error | null, size?: number | undefined) => {
        if (err) reject(err);

        debug('LocalApi::getAppCacheSize resolves', size);
        resolve(size);
      });
    });
  }

  async clearCache(serviceId: string | null = null) {
    const targetsToClear = {
      storages: [
        'appcache',
        'filesystem',
        'indexdb',
        'shadercache',
        'websql',
        'serviceworkers',
        'cachestorage',
      ],
      quotas: ['temporary', 'persistent', 'syncable'],
    };
    ipcRenderer.send('clear-storage-data', { serviceId, targetsToClear });
    return ipcRenderer.invoke('clear-cache', { serviceId });
  }
}
