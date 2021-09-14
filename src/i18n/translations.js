/* eslint-disable global-require */
import { APP_LOCALES } from './languages';

const translations = [];
for (const key of Object.keys(APP_LOCALES)) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const translation = require(`./locales/${key}.json`);
    translations[key] = translation;
  } catch {
    console.warn(`Can't find translations for ${key}`);
  }
}

module.exports = translations;
