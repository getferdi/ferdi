/* eslint no-bitwise: ["error", { "int32Hint": true }] */

import { join } from 'path';
import { pathExistsSync, readFileSync } from 'fs-extra';

const debug = require('debug')('Ferdi:DarkMode');

const chars = [...'abcdefghijklmnopqrstuvwxyz'];

const ID = [...Array(20)].map(() => chars[Math.random() * chars.length | 0]).join``;

export function injectDarkModeStyle(recipePath) {
  const darkModeStyle = join(recipePath, 'darkmode.css');
  if (pathExistsSync(darkModeStyle)) {
    const data = readFileSync(darkModeStyle);
    const styles = document.createElement('style');
    styles.id = ID;
    styles.innerHTML = data.toString();

    document.querySelector('head').appendChild(styles);

    debug('Injected Dark Mode style with ID', ID);
  }
}

export function removeDarkModeStyle() {
  const style = document.querySelector(`#${ID}`);

  if (style) {
    style.remove();

    debug('Removed Dark Mode Style with ID', ID);
  }
}

export function isDarkModeStyleInjected() {
  return !!document.querySelector(`#${ID}`);
}
