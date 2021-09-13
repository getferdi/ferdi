import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet, { withTheme } from 'react-jss';
import classnames from 'classnames';

import FullscreenLoader from '../FullscreenLoader';
import { shuffleArray } from '../../../helpers/array-helpers';

import styles from './styles';

// TODO: Need to externalize for i18n
const textList = shuffleArray([
  'Adding free features',
  'Making application usable',
  'Removing unproductive paywalls',
  'Creating custom server software',
  'Increasing productivity',
  'Listening to our userbase',
  'Fixing bugs',
]);

export default @injectSheet(styles) @withTheme class AppLoader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    texts: PropTypes.array,
  };

  static defaultProps = {
    texts: textList,
  }

  state = {
    step: 0,
  };

  interval = null;

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        step: prevState.step === textList.length - 1 ? 0 : prevState.step + 1,
      }));
    }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes, theme, texts } = this.props;
    const { step } = this.state;

    return (
      <FullscreenLoader
        title="Ferdi"
        className={classes.component}
        spinnerColor={theme.colorAppLoaderSpinner}
      >
        {texts.map((text, i) => (
          <span
            key={text}
            className={classnames({
              [`${classes.slogan}`]: true,
              [`${classes.visible}`]: step === i,
            })}
          >
            {text}
          </span>
        ))}
      </FullscreenLoader>
    );
  }
}
