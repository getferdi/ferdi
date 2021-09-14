import localStorage from 'mobx-localstorage';
import { ferdiLocale, ferdiVersion } from '../../environment';

export const prepareAuthRequest = (
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  options = { method: 'GET' },
  auth = true,
) => {
  const request = Object.assign(options, {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Franz-Source': 'desktop',
      'X-Franz-Version': ferdiVersion,
      'X-Franz-platform': process.platform,
      'X-Franz-Timezone-Offset': new Date().getTimezoneOffset(),
      'X-Franz-System-Locale': ferdiLocale,
      ...options.headers,
    },
  });

  if (auth) {
    request.headers.Authorization = `Bearer ${localStorage.getItem(
      'authToken',
    )}`;
  }

  return request;
};

export const sendAuthRequest = (url, options, auth) =>
  window.fetch(url, prepareAuthRequest(options, auth));
