const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // eslint-disable-next-line global-require
  require('husky').install();
}
