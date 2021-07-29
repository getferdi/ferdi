import classnames from 'classnames';
import { Classes } from 'jss';
import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { IFormField } from '../typings/generic';

import styles from './styles';

interface ILabel
  extends IFormField,
    React.LabelHTMLAttributes<HTMLLabelElement> {
  classes: Classes;
  isRequired: boolean;
}

class LabelComponent extends Component<ILabel> {
  static defaultProps = {
    showLabel: true,
  };

  render() {
    const {
      title,
      showLabel,
      classes,
      className,
      children,
      htmlFor,
      isRequired,
    } = this.props;

    if (!showLabel) return children;

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
  }
}

export const Label = injectSheet(styles)(LabelComponent);
