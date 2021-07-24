const expect = require('expect.js');

const {
  colorBackground: colorBackgroundDefault,
} = require('../lib/themes/default');
const { colorBackground: colorBackgroundDark } = require('../lib/themes/dark');
const { default: theme } = require('../lib');

xdescribe('Load theme', () => {
  it('Should load default theme', () => {
    const { colorBackground } = theme('default');
    expect(colorBackground).to.be(colorBackgroundDefault);
  });

  it('Should load dark theme', () => {
    const { colorBackground } = theme('dark');
    expect(colorBackground).to.be(colorBackgroundDark);
  });
});
