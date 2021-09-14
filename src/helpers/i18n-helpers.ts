export function getLocale({
  locale, locales, defaultLocale, fallbackLocale,
}) {
  let localeStr = locale;
  if (locales[locale] === undefined) {
    let localeFuzzy: string | undefined;
    for (const localStr of Object.keys(locales)) {
      if (locales && Object.hasOwnProperty.call(locales, localStr) && locale.slice(0, 2) === localStr.slice(0, 2)) {
          localeFuzzy = localStr;
        }
    }

    if (localeFuzzy !== undefined) {
      localeStr = localeFuzzy;
    }
  }

  if (locales[localeStr] === undefined) {
    localeStr = defaultLocale;
  }

  if (!localeStr) {
    localeStr = fallbackLocale;
  }

  return localeStr;
}

export function getSelectOptions({
  locales, resetToDefaultText = '', automaticDetectionText = '', sort = true,
}) {
  const options: object[] = [];

  if (resetToDefaultText) {
    options.push(
      {
        value: '',
        label: resetToDefaultText,
      },
    );
  }

  if (automaticDetectionText) {
    options.push(
      {
        value: 'automatic',
        label: automaticDetectionText,
      },
    );
  }

  options.push({
    value: '───',
    label: '───',
    disabled: true,
  });

  let keys = Object.keys(locales);
  if (sort) {
    keys = keys.sort(Intl.Collator().compare);
  }
  for (const key of keys) {
    options.push({
      value: key,
      label: locales[key],
    });
  }

  return options;
}
