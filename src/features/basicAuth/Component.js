import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import classnames from 'classnames';

import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import {
  state,
  resetState,
  sendCredentials,
  cancelLogin,
} from './store';
import Form from './Form';

import styles from './styles';
import globalMessages from '../../i18n/globalMessages';

const messages = defineMessages({
  signIn: {
    id: 'feature.basicAuth.signIn',
    defaultMessage: '!!!Sign In',
  },
});

export default @injectSheet(styles) @observer class BasicAuthModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  static contextTypes = {
    intl: intlShape,
  };

  submit(e) {
    e.preventDefault();

    const values = Form.values();

    sendCredentials(values.user, values.password);
    resetState();
  }

  cancel() {
    cancelLogin();
    this.close();
  }

  close() {
    resetState();
    state.isModalVisible = false;
  }

  render() {
    const {
      classes,
    } = this.props;

    const {
      isModalVisible,
      authInfo,
    } = state;

    if (!authInfo) {
      return null;
    }

    const { intl } = this.context;

    return (
      <Modal
        isOpen={isModalVisible}
        className={classes.modal}
        close={this.cancel.bind(this)}
        showClose={false}
      >
        <h1>{intl.formatMessage(messages.signIn)}</h1>
        <p>
          http
          {authInfo.port === 443 && 's'}
          ://
          {authInfo.host}
        </p>
        <form
          onSubmit={this.submit.bind(this)}
          className={classnames('franz-form', classes.form)}
        >
          <Input
            field={Form.$('user')}
            showLabel={false}
          />
          <Input
            field={Form.$('password')}
            showLabel={false}
            showPasswordToggle
          />
          <div className={classes.buttons}>
            <Button
              type="button"
              label={intl.formatMessage(globalMessages.cancel)}
              buttonType="secondary"
              onClick={this.cancel.bind(this)}
            />
            <Button
              type="submit"
              label={intl.formatMessage(messages.signIn)}
            />
          </div>
        </form>
      </Modal>
    );
  }
}
