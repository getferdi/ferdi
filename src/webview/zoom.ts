import { ipcRenderer, webFrame } from 'electron';

const maxZoomLevel = 9;
const minZoomLevel = -8;
let zoomLevel = 0;

ipcRenderer.on('zoomIn', () => {
  if (maxZoomLevel > zoomLevel) {
    zoomLevel += 1;
  }
  webFrame.setZoomLevel(zoomLevel);

  ipcRenderer.sendToHost('zoomLevel', { zoom: zoomLevel });
});

ipcRenderer.on('zoomOut', () => {
  if (minZoomLevel < zoomLevel) {
    zoomLevel -= 1;
  }
  webFrame.setZoomLevel(zoomLevel);

  ipcRenderer.sendToHost('zoomLevel', { zoom: zoomLevel });
});

ipcRenderer.on('zoomReset', () => {
  zoomLevel = 0;
  webFrame.setZoomLevel(zoomLevel);

  ipcRenderer.sendToHost('zoomLevel', { zoom: zoomLevel });
});

ipcRenderer.on('setZoom', (_e, arg) => {
  zoomLevel = arg;
  webFrame.setZoomLevel(zoomLevel);
});
