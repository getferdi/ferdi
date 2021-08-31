import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ElectronWebView from 'react-electron-web-view';
import { intlShape } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { join } from 'path';

export default @inject('stores', 'actions') @observer class ExtensionPopup extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      path,
    } = this.props;

    return (
      <div
        style={{
          position: 'absolute',
          bottom: 3,
          left: 370,
          height: 'auto',
          width: 'auto',
          backgroundColor: '#e7e7e7',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <ElectronWebView
          ref={(webview) => {
            this.webview = webview;
          }}
          autosize
          src={path}
          preload={
            join(__dirname, '../../features/extensions/polyfills/index.js')
          }
          disablewebsecurity
          allowpopups
          devTools
          style={{
            minHeight: 300,
            minWidth: 500,
          }}
        />
      </div>

    );
  }
}
