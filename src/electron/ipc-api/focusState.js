export default (params) => {
  params.mainWindow.on('focus', () => {
    params.mainWindow.webContents.send('isWindowFocused', true);
  });

  params.mainWindow.on('blur', () => {
    params.mainWindow.webContents.send('isWindowFocused', false);
  });
};
