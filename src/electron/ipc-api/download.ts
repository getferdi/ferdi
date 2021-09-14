import { ipcMain, dialog, BrowserWindow } from 'electron';
import { download } from 'electron-dl';
import mime from 'mime-types';
import { writeFileSync } from 'fs-extra';
import { PathLike } from 'fs';

const debug = require('debug')('Ferdi:ipcApi:download');

function decodeBase64Image(dataString: string) {
  const matches = dataString.match(/^data:([+/A-Za-z-]+);base64,(.+)$/);

  if (matches?.length !== 3) {
    return new Error('Invalid input string');
  }

  return Buffer.from(matches[2], 'base64');
}

export default (params: { mainWindow: BrowserWindow }) => {
  ipcMain.on(
    'download-file',
    async (_event, { url, content, fileOptions = {} }) => {
      const win = BrowserWindow.getFocusedWindow();

      try {
        if (!content) {
          const dl = await download(win!, url, {
            saveAs: true,
          });
          debug('File saved to', dl.savePath);
        } else {
          const extension = mime.extension(fileOptions.mime);
          const filename = `${fileOptions.name}.${extension}`;

          try {
            const saveDialog = await dialog.showSaveDialog(params.mainWindow, {
              defaultPath: filename,
            });

            if (saveDialog.canceled) return;

            const binaryImage = decodeBase64Image(content);
            writeFileSync(
              saveDialog.filePath as PathLike,
              binaryImage as unknown as string,
              'binary',
            );

            debug('File blob saved to', saveDialog.filePath);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
  );
};
