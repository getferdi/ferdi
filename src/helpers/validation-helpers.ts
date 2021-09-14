import { defineMessages } from 'react-intl';
import isEmail from 'validator/lib/isEmail';

const messages = defineMessages({
  required: {
    id: 'validation.required',
    defaultMessage: 'Field is required',
  },
  email: {
    id: 'validation.email',
    defaultMessage: 'Email not valid',
  },
  url: {
    id: 'validation.url',
    defaultMessage: 'Not a valid URL',
  },
  minLength: {
    id: 'validation.minLength',
    defaultMessage: 'Too few characters',
  },
  oneRequired: {
    id: 'validation.oneRequired',
    defaultMessage: 'At least one is required',
  },
});

export function required({ field }) {
  const isValid = field.value.trim() !== '';
  return [
    isValid,
    (window as any).ferdi.intl.formatMessage(messages.required, {
      field: field.label,
    }),
  ];
}

export function email({ field }) {
  const value = field.value.trim();
  const isValid = isEmail(value);
  return [
    isValid,
    (window as any).ferdi.intl.formatMessage(messages.email, {
      field: field.label,
    }),
  ];
}

export function url({ field }) {
  const value = field.value.trim();
  let isValid = false;

  isValid =
    value !== ''
      ? Boolean(
          // eslint-disable-next-line unicorn/better-regex
          /(^|[\s.:;?\-\]<(])(https?:\/\/[-\w;/?:@&=+$|_.!~*|'()[\]%#,☺]+[\w/#](\(\))?)(?=$|[\s',|().:;?\-[\]>)])/i.test(
            value,
          ),
        )
      : true;

  return [
    isValid,
    (window as any).ferdi.intl.formatMessage(messages.url, {
      field: field.label,
    }),
  ];
}

export function minLength(length: number) {
  return ({ field }) => {
    let isValid = true;
    if (field.touched) {
      isValid = field.value.length >= length;
    }
    return [
      isValid,
      (window as any).ferdi.intl.formatMessage(messages.minLength, {
        field: field.label,
        length,
      }),
    ];
  };
}

export function oneRequired(targets: string[]) {
  return ({ field, form }) => {
    const invalidFields = targets.filter(target => form.$(target).value === '');
    return [
      targets.length !== invalidFields.length,
      (window as any).ferdi.intl.formatMessage(messages.required, {
        field: field.label,
      }),
    ];
  };
}
