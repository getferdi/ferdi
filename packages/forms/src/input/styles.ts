import { Theme } from '@meetfranz/theme';
import * as CSS from 'csstype';

const prefixStyles = (theme: Theme) => ({
  background: theme.inputPrefixBackground,
  color: theme.inputPrefixColor,
  lineHeight: `${theme.inputHeight}px`,
  padding: '0 10px',
  fontSize: theme.uiFontSize,
});

export default (theme: Theme) => ({
  label: {
    '& > div': {
      marginTop: 5,
    },
  },
  disabled: {
    opacity: theme.inputDisabledOpacity,
  },
  formModifier: {
    background: 'none',
    border: 0,
    borderLeft: theme.inputBorder,
    padding: '4px 20px 0',
    outline: 'none',

    '&:active': {
      opacity: 0.5,
    },

    '& svg': {
      fill: theme.inputModifierColor,
    },
  },
  input: {
    background: 'none',
    border: 0,
    fontSize: theme.uiFontSize,
    outline: 'none',
    padding: 8,
    width: '100%',
    color: theme.inputColor,

    '&::placeholder': {
      color: theme.inputPlaceholderColor,
    },
  },
  passwordScore: {
    background: theme.inputScorePasswordBackground,
    border: theme.inputBorder,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.borderRadiusSmall,
    borderBottomRightRadius: theme.borderRadiusSmall,
    display: 'block',
    flexBasis: '100%',
    height: 5,
    overflow: 'hidden',

    '& meter': {
      display: 'block',
      height: '100%',
      width: '100%',

      '&::-webkit-meter-bar': {
        background: 'none',
      },

      '&::-webkit-meter-even-less-good-value': {
        background: theme.brandDanger,
      },

      '&::-webkit-meter-suboptimum-value': {
        background: theme.brandWarning,
      },

      '&::-webkit-meter-optimum-value': {
        background: theme.brandSuccess,
      },
    },
  },
  prefix: prefixStyles(theme),
  suffix: prefixStyles(theme),
  wrapper: {
    background: theme.inputBackground,
    border: theme.inputBorder,
    borderRadius: theme.borderRadiusSmall,
    boxSizing: 'border-box' as CSS.Property.BoxSizing,
    display: 'flex',
    height: theme.inputHeight,
    order: 1,
    width: '100%',
  },
  hasPasswordScore: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  hasError: {
    borderColor: theme.brandDanger,
  },
});
