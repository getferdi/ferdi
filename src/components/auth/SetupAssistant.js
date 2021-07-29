import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import { Input, Button } from '@meetfranz/forms';
import { Badge } from '@meetfranz/ui';
import Modal from '../ui/Modal';
import Infobox from '../ui/Infobox';
import Appear from '../ui/effects/Appear';

import { CDN_URL } from '../../config';

const SLACK_ID = 'slack';

const messages = defineMessages({
  headline: {
    id: 'setupAssistant.headline',
    defaultMessage: '!!!Let\'s get started',
  },
  subHeadline: {
    id: 'setupAssistant.subheadline',
    defaultMessage: '!!!Choose from our most used services and get back on top of your messaging now.',
  },
  submitButtonLabel: {
    id: 'setupAssistant.submit.label',
    defaultMessage: '!!!Let\'s go',
  },
  inviteSuccessInfo: {
    id: 'invite.successInfo',
    defaultMessage: '!!!Invitations sent successfully',
  },
});

const styles = (theme) => ({
  root: {
    width: '500px !important',
    textAlign: 'center',
    padding: 20,

    '& h1': {
    },
  },
  servicesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceContainer: {
    background: theme.colorBackground,
    position: 'relative',
    width: '32%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    borderRadius: theme.borderRadius,
    marginBottom: 10,
    opacity: 0.5,
    transition: 'all 0.25s',
    border: [3, 'solid', 'transparent'],

    '& h2': {
      margin: [10, 0, 0],
      color: theme.colorText,
    },

    '&:hover': {
      border: [3, 'solid', theme.brandPrimary],
      '& $serviceIcon': {
      },
    },

  },
  selected: {
    border: [3, 'solid', theme.brandPrimary],
    background: `${theme.brandPrimary}47`,
    opacity: 1,
  },
  serviceIcon: {
    width: 50,
    transition: 'all 0.25s',
  },

  slackModalContent: {
    textAlign: 'center',

    '& img': {
      width: 50,
      marginBottom: 20,
    },
  },
  modalActionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaCancel: {
    background: 'none !important',
  },
  slackBadge: {
    position: 'absolute',
    bottom: 4,
    height: 'auto',
    padding: '0px 4px',
    borderRadius: theme.borderRadiusSmall,
    margin: 0,
    display: 'flex',
    overflow: 'hidden',
  },
  clearSlackWorkspace: {
    background: theme.inputPrefixColor,
    marginLeft: 5,
    height: '100%',
    color: theme.colorText,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -4,
    padding: [0, 5],
  },
});

@injectSheet(styles) @observer
class SetupAssistant extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isInviteSuccessful: PropTypes.bool,
    services: PropTypes.object.isRequired,
    isSettingUpServices: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isInviteSuccessful: false,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    services: [{
      id: 'whatsapp',
    }, {
      id: 'messenger',
    }, {
      id: 'gmail',
    }],
    isSlackModalOpen: false,
    slackWorkspace: '',
  };

  slackWorkspaceHandler() {
    const { slackWorkspace = '', services } = this.state;

    const sanitizedWorkspace = slackWorkspace.trim().replace(/^https?:\/\//, '');

    if (sanitizedWorkspace) {
      const index = services.findIndex((s) => s.id === SLACK_ID);

      if (index === -1) {
        const newServices = services;
        newServices.push({ id: SLACK_ID, team: sanitizedWorkspace });
        this.setState({ services: newServices });
      }
    }

    this.setState({
      isSlackModalOpen: false,
      slackWorkspace: sanitizedWorkspace,
    });
  }

  render() {
    const { intl } = this.context;
    const {
      classes, isInviteSuccessful, onSubmit, services, isSettingUpServices,
    } = this.props;
    const { isSlackModalOpen, slackWorkspace, services: addedServices } = this.state;

    return (
      <div className={`auth__container ${classes.root}`}>
        {this.state.showSuccessInfo && isInviteSuccessful && (
          <Appear>
            <Infobox
              type="success"
              icon="checkbox-marked-circle-outline"
              dismissable
            >
              {intl.formatMessage(messages.inviteSuccessInfo)}
            </Infobox>
          </Appear>
        )}

        <img
          src="./assets/images/logo.svg"
          className="auth__logo"
          alt=""
        />
        <h1>
          {intl.formatMessage(messages.headline)}
        </h1>
        <h2>
          {intl.formatMessage(messages.subHeadline)}
        </h2>
        <div className={classnames('grid', classes.servicesGrid)}>
          {Object.keys(services).map((id) => {
            const service = services[id];
            return (
              <button
                className={classnames({
                  [classes.serviceContainer]: true,
                  [classes.selected]: this.state.services.findIndex((s) => s.id === id) !== -1,
                })}
                key={id}
                onClick={() => {
                  const index = this.state.services.findIndex((s) => s.id === id);
                  if (index === -1) {
                    if (id === SLACK_ID) {
                      this.setState({ isSlackModalOpen: true });
                    } else {
                      addedServices.push({ id });
                    }
                  } else {
                    addedServices.splice(index, 1);
                    if (id === SLACK_ID) {
                      this.setState({
                        slackWorkspace: '',
                      });
                    }
                  }

                  this.setState({ services: addedServices });
                }}
                type="button"
              >
                <img
                  src={`${CDN_URL}/recipes/dist/${id}/src/icon.svg`}
                  className={classes.serviceIcon}
                  alt=""
                />
                <h2>
                  {service.name}
                </h2>
                {id === SLACK_ID && slackWorkspace && (
                  <Badge type="secondary" className={classes.slackBadge}>
                    {slackWorkspace}
                    <button
                      type="button"
                      className={classes.clearSlackWorkspace}
                      onClick={() => {
                        this.setState({
                          slackWorkspace: '',
                        });
                      }}
                    >
                      x
                    </button>
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
        <Modal
          isOpen={isSlackModalOpen}
          // isBlocking={false}
          close={() => this.setState({ isSlackModalOpen: false })}
        >
          <div className={classes.slackModalContent}>
            <img src={`${CDN_URL}/recipes/dist/slack/src/icon.svg`} alt="" />
            <h1>Create your first Slack workspace</h1>
            <form onSubmit={(e) => {
              e.preventDefault();
              this.slackWorkspaceHandler();
            }}
            >
              <Input
                suffix=".slack.com"
                placeholder="workspace-url"
                onChange={(e) => this.setState({ slackWorkspace: e.target.value })}
                value={slackWorkspace}
              />
              <div className={classes.modalActionContainer}>
                <Button
                  type="submit"
                  label="Save"
                />
                <Button
                  type="link"
                  buttonType="secondary"
                  label="Cancel"
                  className={classes.ctaCancel}
                  onClick={() => this.setState({ slackWorkspace: '' })}
                />
              </div>
            </form>
          </div>
        </Modal>
        <Button
          type="button"
          className="auth__button"
            // disabled={!atLeastOneEmailAddress}
          label={intl.formatMessage(messages.submitButtonLabel)}
          onClick={() => onSubmit(this.state.services)}
          busy={isSettingUpServices}
          disabled={isSettingUpServices || addedServices.length === 0}
        />
      </div>
    );
  }
}

export default SetupAssistant;
