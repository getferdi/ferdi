import { systemPreferences, dialog } from 'electron';
import { pathExistsSync, mkdirSync, writeFileSync } from 'fs-extra';
import { isMacOSVersionGreaterThanOrEqualTo } from 'macos-version';
import { dirname } from 'path';
import { askForScreenCaptureAccess } from 'node-mac-permissions';
import { userDataPath } from '../environment';

const debug = require('debug')('Ferdi:macOSPermissions');

const isExplicitScreenCapturePermissionReqd =
  isMacOSVersionGreaterThanOrEqualTo('10.15');
debug(
  `Should check explicitly for screen-capture permissions: ${isExplicitScreenCapturePermissionReqd}`,
);

const filePath = userDataPath('.has-app-requested-screen-capture-permissions');

function hasPromptedForScreenCapturePermission() {
  if (!isExplicitScreenCapturePermissionReqd) {
    return false;
  }

  debug('Checking if status file exists');
  return filePath && pathExistsSync(filePath);
}

function hasScreenCapturePermissionAlreadyBeenGranted() {
  if (!isExplicitScreenCapturePermissionReqd) {
    return true;
  }

  const screenCaptureStatus = systemPreferences.getMediaAccessStatus('screen');
  debug(`screen-capture permissions status: ${screenCaptureStatus}`);
  return screenCaptureStatus === 'granted';
}

function createStatusFile() {
  try {
    writeFileSync(filePath, '');
  } catch (error) {
    if (error.code === 'ENOENT') {
      mkdirSync(dirname(filePath));
      writeFileSync(filePath, '');
    }

    throw error;
  }
}

export const askFormacOSPermissions = async mainWindow => {
  debug('Checking camera & microphone permissions');
  systemPreferences.askForMediaAccess('camera');
  systemPreferences.askForMediaAccess('microphone');

  if (hasScreenCapturePermissionAlreadyBeenGranted()) {
    debug('Already obtained screen-capture permissions - writing status file');
    createStatusFile();
    return;
  }

  if (!hasPromptedForScreenCapturePermission()) {
    debug('Checking screen capture permissions');

    const { response } = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      message: 'Enable Screen Sharing',
      detail:
        'To enable screen sharing for some services, Ferdi needs the permission to record your screen.',
      buttons: ['Allow screen sharing', 'No', 'Ask me later'],
      defaultId: 0,
      cancelId: 2,
    });

    if (response === 0) {
      debug('Asking for access');
      askForScreenCaptureAccess();
      createStatusFile();
    } else if (response === 1) {
      debug("Don't ask again");
      createStatusFile();
    }
  }
};
