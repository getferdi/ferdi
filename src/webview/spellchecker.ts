import { getCurrentWebContents } from '@electron/remote';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';
import { DEFAULT_APP_SETTINGS, isMac } from '../environment';

const debug = require('debug')('Ferdi:spellchecker');

const { session } = getCurrentWebContents();
const [defaultLocale] = session.getSpellCheckerLanguages();
debug('Spellchecker default locale is', defaultLocale);

export function getSpellcheckerLocaleByFuzzyIdentifier(identifier: string) {
  const locales = Object.keys(SPELLCHECKER_LOCALES).filter((key) => key.toLocaleLowerCase() === identifier.toLowerCase() || key.split('-')[0] === identifier.toLowerCase());

  return locales.length >= 1 ? locales[0] : null;
}

export function switchDict(locale: string) {
  if (isMac) {
    debug('Ignoring dictionary changes on macOS');
    return;
  }

  debug('Setting spellchecker locale to', locale);

  const locales: string[] = [];

  const foundLocale = getSpellcheckerLocaleByFuzzyIdentifier(locale);
  if (foundLocale) {
    locales.push(foundLocale);
  }

  locales.push(defaultLocale, DEFAULT_APP_SETTINGS.fallbackLocale);

  session.setSpellCheckerLanguages(locales);
}
