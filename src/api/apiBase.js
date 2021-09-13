/**
 * Get API base URL from store
 */
import {
  API_VERSION,
} from '../environment';
import {
  DEV_API_FRANZ_WEBSITE,
  LIVE_FRANZ_API,
  LOCAL_HOSTNAME,
  LOCAL_SERVER,
  SERVER_NOT_LOADED,
} from '../config';

// Note: This cannot be used from the internal-server since we are not running within the context of a browser window
const apiBase = (withVersion = true) => {
  let url;

  if (!window.ferdi
    || !window.ferdi.stores.settings
    || !window.ferdi.stores.settings.all
    || !window.ferdi.stores.settings.all.app.server) {
    // Stores have not yet been loaded - return SERVER_NOT_LOADED to force a retry when stores are loaded
    return SERVER_NOT_LOADED;
  }
  if (window.ferdi.stores.settings.all.app.server === LOCAL_SERVER) {
    // Use URL for local server
    url = `http://${LOCAL_HOSTNAME}:${window.ferdi.stores.requests.localServerPort}`;
  } else {
    // Load URL from store
    url = window.ferdi.stores.settings.all.app.server;
  }

  return withVersion ? `${url}/${API_VERSION}` : url;
};

export default apiBase;

export function termsBase() {
  // TODO: This needs to handle local vs ferdi vs franz servers
  return window.ferdi.stores.settings.all.app.server !== LIVE_FRANZ_API ? window.ferdi.stores.settings.all.app.server : DEV_API_FRANZ_WEBSITE;
}
