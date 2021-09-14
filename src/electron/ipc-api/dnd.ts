import { ipcMain } from 'electron';
import { getDoNotDisturb } from 'macos-notification-state';
import { isMac } from '../../environment';

const debug = require('debug')('Ferdi:ipcApi:dnd');

export default async () => {
  ipcMain.handle('get-dnd', async () => {
    if (!isMac) {
      debug('Not on macOS, returning', false);
      return false;
    }

    try {
      const isDND = getDoNotDisturb();
      debug('Fetching DND state, set to', isDND);
      return isDND;
    } catch (e) {
      console.error(e);
      return false;
    }
  });
};
