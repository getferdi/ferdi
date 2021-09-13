import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { IFormField } from '../typings/generic';

import styles from './styles';

interface ILabel
  extends IFormField,
    React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

const useStyles = createUseStyles(styles);

export const Label = ({
  title,
  showLabel = true,
  className,
  children,
  htmlFor,
  isRequired = false,
}: ILabel) => {
  const classes = useStyles();

  if (!showLabel) return <>{children}</>;

  return (
    <label
      className={classnames({
        [`${className}`]: className,
      })}
      htmlFor={htmlFor}
    >
      {showLabel && (
        <span className={classes.label}>
          {title}
          {isRequired && ' *'}
        </span>
      )}
      <div className={classes.content}>{children}</div>
    </label>
  );
};
