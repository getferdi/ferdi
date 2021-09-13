import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, injectIntl } from 'react-intl';

import FullscreenLoader from '../FullscreenLoader';
import styles from './styles';

const messages = defineMessages({
  loading: {
    id: 'service.webviewLoader.loading',
    defaultMessage: 'Loading {service}',
  },
});

@injectSheet(styles)
@observer
class WebviewLoader extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes, name } = this.props;
    const { intl } = this.props;
    return (
      <FullscreenLoader
        className={classes.component}
        title={`${intl.formatMessage(messages.loading, { service: name })}`}
      />
    );
  }
}

export default injectIntl(WebviewLoader);
