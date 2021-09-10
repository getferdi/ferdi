import expect from 'expect.js';

import makeDefaultThemeConfig from '../src/themes/default';
import makeDarkThemeConfig from '../src/themes/dark';
import { theme, ThemeType } from '../src';

describe('Load theme', () => {
  it('Should load default theme', () => {
    const { colorBackground } = theme('default' as ThemeType);
    expect(colorBackground).to.be(
      makeDefaultThemeConfig('default').colorBackground,
    );
  });

  it('Should load dark theme', () => {
    const { colorBackground } = theme('dark' as ThemeType);
    expect(colorBackground).to.be(makeDarkThemeConfig('dark').colorBackground);
  });
});
