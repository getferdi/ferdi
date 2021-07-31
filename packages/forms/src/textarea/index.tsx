import classnames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import { IFormField, IWithStyle } from '../typings/generic';

import { Error } from '../error';
import { Label } from '../label';
import { Wrapper } from '../wrapper';

import styles from './styles';

interface IData {
  [index: string]: string;
}

interface IProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    IFormField,
    IWithStyle {
  focus?: boolean;
  data: IData;
  textareaClassName?: string;
}

const useStyles = createUseStyles(styles);

export const Textarea = ({
  className,
  disabled = false,
  error,
  id,
  textareaClassName,
  label,
  showLabel = true,
  value,
  name,
  placeholder,
  spellCheck,
  onBlur = () => {},
  onFocus = () => {},
  minLength,
  maxLength,
  required,
  rows = 5,
  noMargin,
  data,
  onChange,
}: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef && textareaRef.current && data) {
      Object.keys(data).map(
        key => (textareaRef.current!.dataset[key] = data[key]),
      );
    }
  }, [data]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const classes = useStyles();

  return (
    <Wrapper
      className={className}
      identifier="franz-textarea"
      noMargin={noMargin}
    >
      <Label
        title={label}
        showLabel={showLabel}
        htmlFor={id}
        className={classes.label}
        isRequired={required}
      >
        <div
          className={classnames({
            [`${textareaClassName}`]: textareaClassName,
            [`${classes.wrapper}`]: true,
            [`${classes.disabled}`]: disabled,
            [`${classes.hasError}`]: error,
          })}
        >
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            spellCheck={spellCheck}
            className={classes.textarea}
            ref={textareaRef}
            onChange={handleOnChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            minLength={minLength}
            maxLength={maxLength}
            rows={rows}
          >
            {value}
          </textarea>
        </div>
      </Label>
      {error && <Error message={error} />}
    </Wrapper>
  );
};
