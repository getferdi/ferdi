import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../lib/Form';
import { required, email } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from '../ui/Link';
import Infobox from '../ui/Infobox';

const messages = defineMessages({
  headline: {
    id: 'password.headline',
    defaultMessage: '!!!Forgot password',
  },
  emailLabel: {
    id: 'password.email.label',
    defaultMessage: '!!!Email address',
  },
  submitButtonLabel: {
    id: 'password.submit.label',
    defaultMessage: '!!!Submit',
  },
  successInfo: {
    id: 'password.successInfo',
    defaultMessage: '!!!Your new password was sent to your email address',
  },
  noUser: {
    id: 'password.noUser',
    defaultMessage: '!!!No user affiliated with that email address',
  },
  signupLink: {
    id: 'password.link.signup',
    defaultMessage: '!!!Create a free account',
  },
  loginLink: {
    id: 'password.link.login',
    defaultMessage: '!!!Sign in to your account',
  },
});

export default @observer class Password extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    signupRoute: PropTypes.string.isRequired,
    loginRoute: PropTypes.string.isRequired,
    status: MobxPropTypes.arrayOrObservableArray.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      email: {
        label: this.context.intl.formatMessage(messages.emailLabel),
        value: '',
        validators: [required, email],
      },
    },
  }, this.context.intl);

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit(form.values());
      },
      onError: () => {},
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const {
      isSubmitting,
      signupRoute,
      loginRoute,
      status,
    } = this.props;

    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={(e) => this.submit(e)}>
          <img
            src="./assets/images/logo.svg"
            className="auth__logo"
            alt=""
          />
          <h1>{intl.formatMessage(messages.headline)}</h1>
          {status.length > 0 && status.includes('sent') && (
            <Infobox
              type="success"
              icon="checkbox-marked-circle-outline"
            >
              {intl.formatMessage(messages.successInfo)}
            </Infobox>
          )}
          <Input
            field={form.$('email')}
            focus
          />
          {status.length > 0 && status.includes('no-user') && (
            <p className="error-message center">{intl.formatMessage(messages.noUser)}</p>
          )}
          {isSubmitting ? (
            <Button
              className="auth__button is-loading"
              buttonType="secondary"
              label={`${intl.formatMessage(messages.submitButtonLabel)} ...`}
              loaded={false}
              disabled
            />
          ) : (
            <Button
              type="submit"
              className="auth__button"
              label={intl.formatMessage(messages.submitButtonLabel)}
            />
          )}
        </form>
        <div className="auth__links">
          <Link to={loginRoute}>{intl.formatMessage(messages.loginLink)}</Link>
          <Link to={signupRoute}>{intl.formatMessage(messages.signupLink)}</Link>
        </div>
      </div>
    );
  }
}
