import classnames from 'classnames';
import { Property } from 'csstype';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { IFormField, IWithStyle } from '../typings/generic';
import { Theme } from '../../../theme';

import { Error } from '../error';
import { Label } from '../label';
import { Wrapper } from '../wrapper';

interface IProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    IFormField,
    IWithStyle {
  className?: string;
}

const useStyles = createUseStyles((theme: Theme) => ({
  toggle: {
    background: theme.toggleBackground,
    borderRadius: theme.borderRadius,
    height: theme.toggleHeight,
    position: 'relative' as Property.Position,
    width: theme.toggleWidth,
  },
  button: {
    background: theme.toggleButton,
    borderRadius: '100%',
    boxShadow: '0 1px 4px rgba(0, 0, 0, .3)',
    width: theme.toggleHeight - 2,
    height: theme.toggleHeight - 2,
    left: 1,
    top: 1,
    position: 'absolute' as Property.Position,
    transition: 'all .5s',
  },
  buttonActive: {
    background: theme.toggleButtonActive,
    left: theme.toggleWidth - theme.toggleHeight + 1,
  },
  input: {
    visibility: 'hidden' as any,
  },
  disabled: {
    opacity: theme.inputDisabledOpacity,
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',

    '& > span': {
      order: 1,
      marginLeft: 15,
    },
  },
}));

export const Toggle = ({
  className,
  disabled = false,
  error = '',
  id,
  label,
  showLabel = true,
  checked,
  value,
  onChange = () => {},
}: IProps) => {
  const classes = useStyles();

  return (
    <Wrapper className={className} identifier="franz-toggle">
      <Label
        title={label}
        showLabel={showLabel}
        htmlFor={id}
        className={classes.toggleLabel}
      >
        <div
          className={classnames({
            [`${classes.toggle}`]: true,
            [`${classes.disabled}`]: disabled,
          })}
        >
          <div
            className={classnames({
              [`${classes.button}`]: true,
              [`${classes.buttonActive}`]: checked,
            })}
          />
          <input
            className={classes.input}
            id={id}
            type="checkbox"
            checked={checked}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      </Label>
      {error && <Error message={error} />}
    </Wrapper>
  );
};
