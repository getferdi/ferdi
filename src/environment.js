import os from 'os';
import { join } from 'path';

import { is, api as electronApi } from 'electron-util';

import { DEFAULT_ACCENT_COLOR } from '@meetfranz/theme';

import osName from 'os-name';
import * as buildInfo from 'preval-build-info';

import {
  LIVE_FERDI_API,
  DEV_FRANZ_API,
  LOCAL_API,
  LOCAL_API_WEBSITE,
  DEV_API_FRANZ_WEBSITE,
  LIVE_API_FERDI_WEBSITE,
  LIVE_WS_API,
  LOCAL_WS_API,
  DEV_WS_API,
  LOCAL_TODOS_FRONTEND_URL,
  PRODUCTION_TODOS_FRONTEND_URL,
  DEFAULT_TODO_SERVICE,
  SEARCH_ENGINE_DDG,
  iconSizeBias,
} from './config';

import { asarPath } from './helpers/asar-helpers';

export const { app } = electronApi;
export const ferdiVersion = app.getVersion();
export const electronVersion = process.versions.electron;
export const chromeVersion = process.versions.chrome;
export const nodeVersion = process.versions.node;
export const ferdiLocale = app.getLocale();

// Set app directory before loading user modules
if (process.env.FERDI_APPDATA_DIR != null) {
  app.setPath('appData', process.env.FERDI_APPDATA_DIR);
  app.setPath('userData', join(app.getPath('appData')));
} else if (process.env.PORTABLE_EXECUTABLE_DIR != null) {
  app.setPath(
    'appData',
    process.env.PORTABLE_EXECUTABLE_DIR,
    `${app.name}AppData`,
  );
  app.setPath('userData', join(app.getPath('appData'), `${app.name}AppData`));
} else if (is.windows) {
  app.setPath('appData', process.env.APPDATA);
  app.setPath('userData', join(app.getPath('appData'), app.name));
}

export const isDevMode = is.development;
if (isDevMode) {
  app.setPath('userData', join(app.getPath('appData'), `${app.name}Dev`));
}

export function userDataPath(...segments) {
  return join(app.getPath('userData'), ...[segments].flat());
}

export function userDataRecipesPath(...segments) {
  return userDataPath('recipes', ...[segments].flat());
}

// Replacing app.asar is not beautiful but unfortunately necessary
export function asarRecipesPath(...segments) {
  return join(asarPath(join(__dirname, 'recipes')), ...[segments].flat());
}

export const useLiveAPI = process.env.USE_LIVE_API;
const useLocalAPI = process.env.USE_LOCAL_API;

export const isMac = is.macos;
export const isWindows = is.windows;
export const isLinux = is.linux;
export const osPlatform = os.platform();
export const osArch = os.arch();
export const osRelease = os.release();
export const is64Bit = osArch.match(/64/);

// for accelerator, show the shortform that electron/OS understands
// for tooltip, show symbol
const ctrlKey = isMac ? '⌘' : 'Ctrl';
const cmdKey = isMac ? 'Cmd' : 'Ctrl';

export const altKey = isMac ? '⌥' : 'Alt';
export const shiftKey = isMac ? '⇧' : 'Shift';

// Platform specific shortcut keys
export const shortcutKey = (isAccelerator = true) =>
  isAccelerator ? cmdKey : ctrlKey;
export const lockFerdiShortcutKey = (isAccelerator = true) =>
  `${shortcutKey(isAccelerator)}+${shiftKey}+L`;
export const todosToggleShortcutKey = (isAccelerator = true) =>
  `${shortcutKey(isAccelerator)}+T`;
export const workspaceToggleShortcutKey = (isAccelerator = true) =>
  `${shortcutKey(isAccelerator)}+D`;
export const muteFerdiShortcutKey = (isAccelerator = true) =>
  `${shortcutKey(isAccelerator)}+${shiftKey}+M`;
export const addNewServiceShortcutKey = (isAccelerator = true) =>
  `${shortcutKey(isAccelerator)}+N`;
export const settingsShortcutKey = (isAccelerator = true) =>
  `${shortcutKey(isAccelerator)}+${isMac ? ',' : 'P'}`;

let api;
let wsApi;
let web;
let todos;
if (!isDevMode || (isDevMode && useLiveAPI)) {
  api = LIVE_FERDI_API;
  wsApi = LIVE_WS_API;
  web = LIVE_API_FERDI_WEBSITE;
  todos = PRODUCTION_TODOS_FRONTEND_URL;
} else if (isDevMode && useLocalAPI) {
  api = LOCAL_API;
  wsApi = LOCAL_WS_API;
  web = LOCAL_API_WEBSITE;
  todos = LOCAL_TODOS_FRONTEND_URL;
} else {
  api = DEV_FRANZ_API;
  wsApi = DEV_WS_API;
  web = DEV_API_FRANZ_WEBSITE;
  todos = PRODUCTION_TODOS_FRONTEND_URL;
}

export const API = api;
export const API_VERSION = 'v1';
export const WS_API = wsApi;
export const WEBSITE = web;
export const TODOS_FRONTEND = todos;

export const DEFAULT_APP_SETTINGS = {
  autoLaunchInBackground: false,
  runInBackground: true,
  reloadAfterResume: true,
  enableSystemTray: true,
  startMinimized: false,
  minimizeToSystemTray: false,
  closeToSystemTray: false,
  privateNotifications: false,
  clipboardNotifications: true,
  notifyTaskBarOnMessage: false,
  showDisabledServices: true,
  showMessageBadgeWhenMuted: true,
  showDragArea: false,
  enableSpellchecking: true,
  spellcheckerLanguage: 'en-us',
  darkMode: isMac && electronApi.nativeTheme.shouldUseDarkColors,
  locale: '',
  fallbackLocale: 'en-US',
  beta: false,
  isAppMuted: false,
  enableGPUAcceleration: true,

  // Ferdi specific options
  server: LIVE_FERDI_API,
  predefinedTodoServer: DEFAULT_TODO_SERVICE,
  autohideMenuBar: false,
  lockingFeatureEnabled: false,
  locked: false,
  lockedPassword: '',
  useTouchIdToUnlock: true,
  scheduledDNDEnabled: false,
  scheduledDNDStart: '17:00',
  scheduledDNDEnd: '09:00',
  hibernateOnStartup: true,
  hibernationStrategy: '300', // seconds
  wakeUpStrategy: '300', // seconds
  inactivityLock: 0,
  automaticUpdates: true,
  showServiceNavigationBar: false,
  universalDarkMode: true,
  userAgentPref: '',
  adaptableDarkMode: true,
  accentColor: DEFAULT_ACCENT_COLOR,
  serviceRibbonWidth: 68,
  iconSize: iconSizeBias,
  sentry: false,
  nightly: false,
  navigationBarBehaviour: 'custom',
  searchEngine: SEARCH_ENGINE_DDG,
  useVerticalStyle: false,
  alwaysShowWorkspaces: false,
};

const buildInfoData = {
  timestamp: buildInfo.timestamp,
  gitHashShort: buildInfo.gitHashShort,
  gitBranch: buildInfo.gitBranch,
};

export function aboutAppDetails() {
  return [
    `Version: ${ferdiVersion}`,
    `Electron: ${electronVersion}`,
    `Chrome: ${chromeVersion}`,
    `Node.js: ${nodeVersion}`,
    `Platform: ${osName()}`,
    `Arch: ${process.arch}`,
    `Build date: ${new Date(Number(buildInfoData.timestamp))}`,
    `Git SHA: ${buildInfoData.gitHashShort}`,
    `Git branch: ${buildInfoData.gitBranch}`,
  ].join('\n');
}
