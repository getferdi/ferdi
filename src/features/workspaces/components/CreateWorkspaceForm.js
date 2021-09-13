import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, injectIntl } from 'react-intl';
import { Input, Button } from '@meetfranz/forms';
import injectSheet from 'react-jss';
import Form from '../../../lib/Form';
import { required } from '../../../helpers/validation-helpers';
import { workspaceStore } from '../index';

const messages = defineMessages({
  submitButton: {
    id: 'settings.workspace.add.form.submitButton',
    defaultMessage: 'Create workspace',
  },
  name: {
    id: 'settings.workspace.add.form.name',
    defaultMessage: 'Name',
  },
});

const styles = () => ({
  form: {
    display: 'flex',
  },
  input: {
    flexGrow: 1,
    marginRight: '10px',
  },
  submitButton: {
    height: 'inherit',
  },
});

@injectSheet(styles)
@observer
class CreateWorkspaceForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  form = (() => {
    const { intl } = this.props;
    return new Form({
      fields: {
        name: {
          label: intl.formatMessage(messages.name),
          placeholder: intl.formatMessage(messages.name),
          value: '',
          validators: [required],
        },
      },
    });
  })();

  submitForm() {
    const { form } = this;
    form.submit({
      onSuccess: async f => {
        const { onSubmit } = this.props;
        const values = f.values();
        onSubmit(values);
      },
    });
  }

  render() {
    const { intl } = this.props;
    const { classes, isSubmitting } = this.props;
    const { form } = this;
    return (
      <div className={classes.form}>
        <Input
          className={classes.input}
          {...form.$('name').bind()}
          showLabel={false}
          onEnterKey={this.submitForm.bind(this, form)}
          focus={workspaceStore.isUserAllowedToUseFeature}
        />
        <Button
          className={classes.submitButton}
          type="submit"
          label={intl.formatMessage(messages.submitButton)}
          onClick={this.submitForm.bind(this, form)}
          busy={isSubmitting}
          buttonType={isSubmitting ? 'secondary' : 'primary'}
        />
      </div>
    );
  }
}

export default injectIntl(CreateWorkspaceForm);
