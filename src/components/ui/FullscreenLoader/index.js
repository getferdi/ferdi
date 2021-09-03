import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet, { withTheme } from 'react-jss';
import classnames from 'classnames';

import Loader from '../Loader';

import styles from './styles';

export default @withTheme @injectSheet(styles) @observer class FullscreenLoader extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    spinnerColor: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: null,
    spinnerColor: null,
    children: null,
  };

  render() {
    const {
      classes,
      title,
      children,
      spinnerColor,
      className,
      theme,
    } = this.props;

    return (
      <div className={classes.wrapper}>
        <div
          className={classnames({
            [`${classes.component}`]: true,
            [`${className}`]: className,
          })}
        >
          <h1 className={classes.title}>{title}</h1>
          <Loader color={spinnerColor || theme.colorFullscreenLoaderSpinner} />
          {children && (
            <div className={classes.content}>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
}
