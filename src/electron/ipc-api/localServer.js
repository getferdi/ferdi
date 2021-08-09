import { ipcMain } from 'electron';
import net from 'net';
import { LOCAL_HOSTNAME, LOCAL_PORT } from '../../config';
import { userDataPath } from '../../environment';
import startServer from '../../internal-server/start';

const portInUse = function (port) {
  return new Promise((resolve) => {
    const server = net.createServer((socket) => {
      socket.write('Echo server\r\n');
      socket.pipe(socket);
    });

    server.listen(port, LOCAL_HOSTNAME);
    server.on('error', () => {
      resolve(true);
    });
    server.on('listening', () => {
      server.close();
      resolve(false);
    });
  });
};

let localServerStarted = false;

export default (params) => {
  ipcMain.on('startLocalServer', () => {
    if (!localServerStarted) {
      // Find next unused port for server
      let port = LOCAL_PORT;
      (async () => {
        // eslint-disable-next-line no-await-in-loop
        while ((await portInUse(port)) && port < LOCAL_PORT + 10) {
          port += 1;
        }
        console.log('Starting local server on port', port);

        startServer(userDataPath(), port);

        params.mainWindow.webContents.send('localServerPort', {
          port,
        });
      })();
      localServerStarted = true;
    }
  });
};
