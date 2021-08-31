import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { permissionText } from '../../../features/extensions/permissions';

import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Infobox from '../../ui/Infobox';

const messages = defineMessages({
  headline: {
    id: 'settings.extensions.store.headline',
    defaultMessage: '!!!Available Extensions',
  },
  installExtension: {
    id: 'settings.extensions.store.installExtension',
    defaultMessage: '!!!Install Extension',
  },
  errorMessage: {
    id: 'settings.extensions.store.errorMessage',
    defaultMessage: '!!!We could not install this extension. Please try again later.',
  },
});
export default @observer class ExtensionStoreScreen extends Component {
  static propTypes = {
    extension: PropTypes.object.isRequired,
    isInstalled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    hasErrored: PropTypes.bool.isRequired,
    isInstalling: PropTypes.bool.isRequired,
    installExtension: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { intl } = this.context;
    const {
      extension, isLoading, isInstalled, isInstalling, installExtension, hasErrored,
    } = this.props;

    // Get most high resolution image
    const iconSize = '128x128';
    const highResImage = extension.images && extension.images[iconSize];

    const manifest = extension.manifest ? JSON.parse(extension.manifest) : {};

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>
            {intl.formatMessage(messages.headline)}
            <span className="separator" />
            {extension.name}
          </h1>
        </div>

        <div className="settings__body extensions recipes">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="extension-info">
              {hasErrored && (
                <Infobox
                  type="danger"
                  icon="alert"
                >
                  {intl.formatMessage(messages.errorMessage)}
                </Infobox>
              )}
              <div className="extension-icon">
                <img
                  src={highResImage}
                  alt="Extension icon"
                />
              </div>

              <h2 className="extension-title">
                {extension.name}
              </h2>
              {extension.title && (
              <p className="extension-info-text">
                {`${extension.title}`}
              </p>
              )}
              {extension.version && (
              <p className="extension-info-text">
                {`Version ${extension.version}`}
              </p>
              )}
              {extension.users && (
              <p className="extension-info-text">
                {`${extension.users} Users`}
              </p>
              )}
              {extension.rating && (
              <p className="extension-info-text">
                {`${Math.round(extension.rating.average)}/5 Stars (${extension.rating.count} Votes)`}
              </p>
              )}

              {extension.description && (
              <p className="extension-description">{extension.description}</p>
              )}

              {extension.website && (
              <div style={{ height: 'auto' }}>
                <a className="extension-homepage" href={extension.website} target="_blank" rel="noreferrer">
                  <i className="mdi mdi-home" />
                  {' '}
                  {extension.website}
                </a>
              </div>
              )}

              {extension.url && (
              <div style={{ height: 'auto' }}>
                <a className="extension-homepage" href={extension.url} target="_blank" rel="noreferrer">
                  <i className="mdi mdi-home" />
                  {' '}
                  View in the Chrome Webstore
                </a>
              </div>
              )}

              {manifest.permissions && (
              <div className="extensions-permissions">
                <p>This extension requests the following permissions:</p>
                <ul>
                  {manifest.permissions.map(permission => (
                    <li key={permission}>
                      -
                      {' '}
                      {permissionText(permission)}
                    </li>
                  ))}
                  {manifest.background && (
                  <li>
                    - Run scripts in the background
                  </li>
                  )}
                </ul>
              </div>
              )}
            </div>
          )}
        </div>
        <div className="settings__controls">
          {isInstalled && (
            <p>You already installed this extension.</p>
          )}

          {/* Save Button */}
          {!isInstalled && isInstalling && (
            <Button
              type="submit"
              label={intl.formatMessage(messages.installExtension)}
              loaded={false}
              buttonType="secondary"
              disabled
            />
          )}
          {!isInstalled && !isInstalling && (
            <Button
              type="submit"
              label={intl.formatMessage(messages.installExtension)}
              htmlForm="form"
              onClick={installExtension}
            />
          )}
        </div>
      </div>

    );
  }
}
