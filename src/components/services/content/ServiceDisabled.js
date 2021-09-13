import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, injectIntl } from 'react-intl';

import Button from '../../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'service.disabledHandler.headline',
    defaultMessage: '{name} is disabled',
  },
  action: {
    id: 'service.disabledHandler.action',
    defaultMessage: 'Enable {name}',
  },
});

@observer
class ServiceDisabled extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    enable: PropTypes.func.isRequired,
  };

  countdownInterval = null;

  countdownIntervalTimeout = 1000;

  render() {
    const { name, enable } = this.props;
    const { intl } = this.props;

    return (
      <div className="services__info-layer">
        <h1>{intl.formatMessage(messages.headline, { name })}</h1>
        <Button
          label={intl.formatMessage(messages.action, { name })}
          buttonType="inverted"
          onClick={() => enable()}
        />
      </div>
    );
  }
}

export default injectIntl(ServiceDisabled);
