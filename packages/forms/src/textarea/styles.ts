import { Theme } from '../../../theme';
import { Property } from 'csstype';

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
  textarea: {
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
  wrapper: {
    background: theme.inputBackground,
    border: theme.inputBorder,
    borderRadius: theme.borderRadiusSmall,
    boxSizing: 'border-box' as Property.BoxSizing,
    display: 'flex',
    order: 1,
    width: '100%',
  },
  hasError: {
    borderColor: theme.brandDanger,
  },
});
