import { BrowserWindow } from 'electron';

export default (params: { mainWindow: BrowserWindow }) => {
  params.mainWindow.on('focus', () => {
    params.mainWindow.webContents.send('isWindowFocused', true);
  });

  params.mainWindow.on('blur', () => {
    params.mainWindow.webContents.send('isWindowFocused', false);
  });
};
