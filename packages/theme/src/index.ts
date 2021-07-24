import makeDarkThemeConfig from './themes/dark';
import makeDefaultThemeConfig from './themes/default';
import { themeBrandPrimary } from './themes/legacy';

export enum ThemeType {
  default = 'default',
  dark = 'dark',
}

export const DEFAULT_ACCENT_COLOR = themeBrandPrimary;

export function theme(
  themeId: ThemeType,
  brandColor: string = DEFAULT_ACCENT_COLOR,
) {
  return themeId === ThemeType.dark
    ? makeDarkThemeConfig(brandColor)
    : makeDefaultThemeConfig(brandColor);
}

const defaultThemeConfigWithDefaultAccentColor =
  makeDefaultThemeConfig(DEFAULT_ACCENT_COLOR);

export type Theme = typeof defaultThemeConfigWithDefaultAccentColor;
