import { mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from '@mdi/react';
import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { IFormField } from '../typings/generic';

import { Error } from '../error';
import { Label } from '../label';
import { Wrapper } from '../wrapper';
import { scorePasswordFunc } from './scorePassword';

import styles from './styles';

interface IData {
  [index: string]: string;
}

interface IProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    IFormField {
  focus?: boolean;
  prefix?: string;
  suffix?: string;
  scorePassword?: boolean;
  showPasswordToggle?: boolean;
  data: IData;
  inputClassName?: string;
  onEnterKey?: Function;
}

const useStyles = createUseStyles(styles);

export const Input = (props: IProps) => {
  const {
    className,
    disabled = false,
    error,
    id,
    inputClassName,
    label,
    prefix,
    scorePassword = false,
    suffix,
    showLabel = true,
    showPasswordToggle = false,
    type = 'text',
    value,
    name,
    placeholder,
    spellCheck,
    // onChange = () => {},
    onBlur = () => {},
    onFocus = () => {},
    min,
    max,
    step,
    required,
    noMargin,
    // focus = false,
  } = props;

  const [passwordScore, setPasswordScore] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { focus, data } = props;

    if (inputRef && inputRef.current) {
      if (focus) {
        inputRef.current.focus();
      }

      if (data) {
        Object.keys(data).map(
          key => (inputRef.current!.dataset[key] = data[key]),
        );
      }
    }
  }, [props]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { scorePassword, onChange } = props;

    if (onChange) {
      onChange(e);
    }

    if (inputRef && inputRef.current && scorePassword) {
      setPasswordScore(scorePasswordFunc(inputRef.current.value));
    }
  };

  const handleOnInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const { onEnterKey } = props;
      onEnterKey && onEnterKey();
    }
  };

  const classes = useStyles();

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <Wrapper className={className} identifier="franz-input" noMargin={noMargin}>
      <Label
        title={label}
        showLabel={showLabel}
        htmlFor={id}
        className={classes.label}
        isRequired={required}
      >
        <div
          className={classnames({
            [`${inputClassName}`]: inputClassName,
            [`${classes.hasPasswordScore}`]: scorePassword,
            [`${classes.wrapper}`]: true,
            [`${classes.disabled}`]: disabled,
            [`${classes.hasError}`]: error,
          })}
        >
          {prefix && <span className={classes.prefix}>{prefix}</span>}
          <input
            id={id}
            type={inputType}
            name={name}
            value={value as string}
            placeholder={placeholder}
            spellCheck={spellCheck}
            className={classes.input}
            ref={inputRef}
            onChange={handleOnChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            onKeyPress={handleOnInputKeyPress}
            min={min}
            max={max}
            step={step}
          />
          {suffix && <span className={classes.suffix}>{suffix}</span>}
          {showPasswordToggle && (
            <button
              type="button"
              className={classes.formModifier}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <Icon path={!showPassword ? mdiEye : mdiEyeOff} size={1} />
            </button>
          )}
        </div>
        {scorePassword && (
          <div
            className={classnames({
              [`${classes.passwordScore}`]: true,
              [`${classes.hasError}`]: error,
            })}
          >
            <meter
              value={passwordScore < 5 ? 5 : passwordScore}
              low={30}
              high={75}
              optimum={100}
              max={100}
            />
          </div>
        )}
      </Label>
      {error && <Error message={error} />}
    </Wrapper>
  );
};
