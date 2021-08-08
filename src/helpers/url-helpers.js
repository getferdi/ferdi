import { ALLOWED_PROTOCOLS } from '../config';

const debug = require('debug')('Ferdi:Helpers:url');

export function isValidExternalURL(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (_) {
    return false;
  }

  const isAllowed = ALLOWED_PROTOCOLS.includes(parsedUrl.protocol);

  debug('protocol check is', isAllowed, 'for:', url);

  return isAllowed;
}
