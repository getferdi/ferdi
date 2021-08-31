import { remote } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import ExtensionActions from './actions';
import { userDataExtensionsPath } from '../../environment';

const extensionsPath = userDataExtensionsPath();

export const loadExtensionInWebView = async (extension, webview) => {
  const webContents = remote.webContents.fromId(webview.getWebContentsId());
  await webContents.session.loadExtension(extension);
};

export const loadExtension = async (extension, extensionStore, loadGlobally = true) => {
  const extPath = path.join(extensionsPath, extension);

  // Don't load already loaded extensions
  if (extensionStore.active.includes(extension)) {
    return;
  }
  ExtensionActions.activate({ id: extension });

  // Load extension globally
  if (loadGlobally) {
    await remote.session.defaultSession.loadExtension(extPath);
  }

  // Load extension in all webviews
  for (const webview of extensionStore.webViews) {
    loadExtensionInWebView(extPath, webview);
  }

  // Load extension information
  const extInfo = await fs.readJSON(path.join(extPath, 'manifest.json'));
  ExtensionActions.addInfo({ id: extension, info: extInfo });

  // Add browser action
  if (extInfo.browser_action) {
    extInfo.browser_action.id = extension;
    extInfo.browser_action.name = extInfo.name;
    ExtensionActions.addAction({ action: extInfo.browser_action });
  }
};

export const loadExtensions = (extensions, extensionStore, loadGlobally = true) => {
  for (const extension of extensions) {
    loadExtension(extension, extensionStore, loadGlobally);
  }
};
