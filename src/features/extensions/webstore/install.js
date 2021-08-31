/**
 * Install a new Chrome extension from the Chrome webstore
 *
 * @param String id Extension ID
 */
import webstore from 'chrome-webstore';
import path from 'path';
import fs from 'fs-extra';
import unzip from 'extract-zip';
import getPlatformInfo from './platformInfo';
import openCRXasZip from './crxToZip';
import { loadExtension } from '../activate';
import { userDataExtensionsPath } from '../../../environment';

const installChromeExtension = (id, activeExtensions) => new Promise(async (resolve, reject) => {
  // Check if extension is already installed
  if (activeExtensions.includes(id)) {
    resolve();
    return;
  }

  // Download CRX from the webstore
  const apiVersion = await webstore.version();

  const platformInfo = getPlatformInfo();

  // Source: https://github.com/Rob--W/crxviewer/blob/master/src/cws_pattern.js#L128
  let url = 'https://clients2.google.com/service/update2/crx?response=redirect';
  url += `&os=${platformInfo.os}`;
  url += `&arch=${platformInfo.arch}`;
  url += `&os_arch=${platformInfo.arch}`; // crbug.com/709147 - should be archName of chrome.system.cpu.getInfo
  url += `&nacl_arch=${platformInfo.nacl_arch}`;
  url += '&prod=chromiumcrx';
  url += '&prodchannel=unknown';
  url += `&prodversion=${apiVersion}`;
  url += '&acceptformat=crx2,crx3';
  url += `&x=id%3D${id}`;
  url += '%26uc';

  const extensionsPath = userDataExtensionsPath();

  const zipPath = path.join(extensionsPath, `${id}.zip`);
  const unpackedPath = path.join(extensionsPath, id);

  try {
    openCRXasZip(url, async (buffer) => {
      // Sucessfully got ZIP
      fs.writeFileSync(zipPath, buffer);

      // Unpack the ZIP file to the final folder
      await unzip(zipPath, { dir: unpackedPath });

      // Load our new extension
      loadExtension(id);

      resolve();
    }, (msg) => {
      // Error
      console.error("Can't download extension: ", msg);
      reject();
    }, () => {});
  } catch (e) {
    console.log('Error:', e);
    reject();
  }
});

export default installChromeExtension;
