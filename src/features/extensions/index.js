import path from 'path';
import fs from 'fs-extra';

import installChromeExtension from './webstore/install';
import ExtensionsStore from './store';

import { loadExtension, loadExtensions, loadExtensionInWebView } from './activate';
import { userDataExtensionsPath } from '../../environment';
import { openPath } from '../../helpers/url-helpers';

const debug = require('debug')('Ferdi:feature:extensions');

export const extensionsPath = userDataExtensionsPath();

export default async function initialize(stores, actions) {
  debug('Initialize extensions feature');

  stores.extensions = new ExtensionsStore();
  const { extensions } = stores;
  extensions.start(stores, actions);

  // Create extensions folder
  await fs.ensureDir(extensionsPath);

  // Helpers for getting information about extensions
  const getExtensionInfo = key => (extensions.infos[key] || {});
  const getExtensionIcon = (key) => {
    const info = getExtensionInfo(key);
    const noIcon = './assets/images/no-extension-icon.png';

    if (!info.icon) {
      return noIcon;
    }

    const largestSize = Math.max(Object.keys(info.icons).map(size => parseInt(size, 10)));
    return path.join(extensionsPath, key, info.icons[largestSize]);
  };

  const openExtensionFolder = (key) => {
    openPath(userDataExtensionsPath(key));
  };

  const deleteExtension = async (key, openSettings = true) => {
    const filePath = path.join(extensionsPath, key);
    await fs.remove(filePath);

    if (openSettings) {
      window.ferdi.stores.router.history.push('/settings/extensions');
    }
  };

  const useWebview = async (webview) => {
    // Don't load already loaded webviews
    if (extensions.webViews.includes(webview)) {
      return;
    }

    extensions.webViews.push(webview);

    // Load all currently loaded exntesions into the webview
    for (const extension of extensions.active) {
      const extPath = path.join(extensionsPath, extension);
      loadExtensionInWebView(extPath, webview);
    }
  };

  // Load all installed extensions asynchronously
  (async () => {
    const directories = (await fs.readdir(extensionsPath, { withFileTypes: true }))
      // Only use directories
      .filter(file => file.isDirectory())
      // Only get directory names
      .map(directory => directory.name);

    debug(`Found and loading ${directories.length} extensions`);

    loadExtensions(directories, extensions);
  })();

  window.ferdi.features.extensions = {
    useWebview,
    loadExtension: (ext, globally = true) => loadExtension(ext, extensions, globally),
    loadExtensions: (ext, globally = true) => loadExtensions(ext, extensions, globally),
    getExtensionInfo,
    getExtensionIcon,
    openExtensionFolder,
    installChromeExtension: id => installChromeExtension(id, extensions.active),
    deleteExtension,
    extensionsPath,
  };
}
