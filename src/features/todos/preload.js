import { ipcRenderer } from 'electron';
import { IPC } from './constants';

const debug = require('debug')('Ferdi:feature:todos:preload');

debug('Preloading Todos Webview');

let hostMessageListener = ({ action }) => {
  switch (action) {
    case 'todos:initialize-as-service':
      ipcRenderer.sendToHost('hello');
      break;
    default:
  }
};

window.ferdi = {
  onInitialize(ipcHostMessageListener) {
    hostMessageListener = ipcHostMessageListener;
    ipcRenderer.sendToHost(IPC.TODOS_CLIENT_CHANNEL, {
      action: 'todos:initialized',
    });
  },
  sendToHost(message) {
    ipcRenderer.sendToHost(IPC.TODOS_CLIENT_CHANNEL, message);
  },
};

ipcRenderer.on(IPC.TODOS_HOST_CHANNEL, (event, message) => {
  debug('Received host message', event, message);
  hostMessageListener(message);
});

if (window.location.href === 'https://app.franztodos.com/login/') {
  // Insert info element informing about Franz accounts
  const infoElement = document.createElement('p');
  infoElement.textContent = `You are using Franz's official Todo Service.
This service will only work with accounts registered with Franz - no Ferdi accounts will work here!
If you do not have a Franz account you can change the Todo service by going into Ferdi's settings and changing the "Todo server".
You can choose any service as this Todo server, e.g. Todoist or Apple Notes.`;

  // Franz Todos uses React. Because of this we can't directly insert the element into the page
  // but we have to wait for React to finish rendering the login page
  let numChecks = 0;
  const waitForReact = setInterval(() => {
    const textElement = document.querySelector('p');
    if (textElement) {
      clearInterval(waitForReact);
      textElement.parentElement?.insertBefore(infoElement, textElement);
    } else {
      numChecks += 1;

      // Stop after ~10 seconds. We are probably not on the login page
      if (numChecks > 1000) {
        clearInterval(waitForReact);
      }
    }
  }, 10);
}
