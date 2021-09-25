import { ipcMain, session } from 'electron';

const debug = require('debug')('Ferdi:ipcApi:sessionStorage');

export default async () => {
  ipcMain.on('clear-storage-data', (_event, { serviceId, targetsToClear }) => {
    try {
      const serviceSession = serviceId ? session.fromPartition(`persist:service-${serviceId}`) : session.defaultSession;
      serviceSession.flushStorageData();
      if (targetsToClear) {
        debug('Clearing targets:', targetsToClear);
        serviceSession.clearStorageData(targetsToClear);
      } else {
        debug('Clearing all targets');
        serviceSession.clearStorageData();
      }
    } catch (error) {
      debug(error);
    }
  });

  ipcMain.handle('clear-cache', (_event, { serviceId }) => {
    const serviceSession = serviceId ? session.fromPartition(`persist:service-${serviceId}`) : session.defaultSession;
    return serviceSession.clearCache();
  });
};
