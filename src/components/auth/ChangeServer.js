import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, injectIntl } from 'react-intl';
import Form from '../../lib/Form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Infobox from '../ui/Infobox';
import { url, required } from '../../helpers/validation-helpers';
import { LIVE_FERDI_API, LIVE_FRANZ_API } from '../../config';
import globalMessages from '../../i18n/globalMessages';

const messages = defineMessages({
  headline: {
    id: 'changeserver.headline',
    defaultMessage: 'Change server',
  },
  label: {
    id: 'changeserver.label',
    defaultMessage: 'Server',
  },
  warning: {
    id: 'changeserver.warning',
    defaultMessage: 'Extra settings offered by Ferdi will not be saved',
  },
  customServerLabel: {
    id: 'changeserver.customServerLabel',
    defaultMessage: 'Custom server',
  },
  urlError: {
    id: 'changeserver.urlError',
    defaultMessage: 'Enter a valid URL',
  },
});

@observer
class ChangeServer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    server: PropTypes.string.isRequired,
  };

  ferdiServer = LIVE_FERDI_API;

  franzServer = LIVE_FRANZ_API;

  defaultServers = [this.franzServer, this.ferdiServer];

  form = new Form(
    {
      fields: {
        server: {
          label: this.props.intl.formatMessage(messages.label),
          value: this.props.server,
          options: [
            { value: this.ferdiServer, label: 'Ferdi' },
            { value: this.franzServer, label: 'Franz' },
            {
              value: this.defaultServers.includes(this.props.server)
                ? ''
                : this.props.server,
              label: 'Custom',
            },
          ],
        },
        customServer: {
          label: this.props.intl.formatMessage(messages.customServerLabel),
          value: '',
          validators: [url, required],
        },
      },
    },
    this.props.intl,
  );

  componentDidMount() {
    if (this.defaultServers.includes(this.props.server)) {
      this.form.$('server').value = this.props.server;
    } else {
      this.form.$('server').value = '';
      this.form.$('customServer').value = this.props.server;
    }
  }

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: form => {
        if (!this.defaultServers.includes(form.values().server)) {
          form.$('server').onChange(form.values().customServer);
        }
        this.props.onSubmit(form.values());
      },
      onError: form => {
        if (this.defaultServers.includes(form.values().server)) {
          this.props.onSubmit(form.values());
        }
      },
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.props;
    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <h1>{intl.formatMessage(messages.headline)}</h1>
          {form.$('server').value === this.franzServer && (
            <Infobox type="warning">
              {intl.formatMessage(messages.warning)}
            </Infobox>
          )}
          <Select field={form.$('server')} />
          {!this.defaultServers.includes(form.$('server').value) && (
            <Input
              placeholder="Custom Server"
              onChange={e => this.submit(e)}
              field={form.$('customServer')}
            />
          )}
          <Button
            type="submit"
            className="auth__button"
            label={intl.formatMessage(globalMessages.submit)}
          />
        </form>
      </div>
    );
  }
}

export default injectIntl(ChangeServer);
