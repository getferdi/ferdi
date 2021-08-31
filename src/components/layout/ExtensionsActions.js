import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { intlShape } from 'react-intl';
import { inject, observer } from 'mobx-react';
import Popup from './ExtensionPopup';
import ExtensionsStore from '../../features/extensions/store';

export default @inject('stores', 'actions') @observer class ExtensionsActions extends Component {
  static propTypes = {
    stores: PropTypes.shape({
      extensions: PropTypes.instanceOf(ExtensionsStore).isRequired,
    }).isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    tooltipEnabled: true,
    openedPopup: false,
    popupTitle: '',
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  enableToolTip() {
    this.setState({ tooltipEnabled: true });
  }

  disableToolTip() {
    this.setState({ tooltipEnabled: false });
  }

  updateToolTip() {
    this.disableToolTip();
    setTimeout(this.enableToolTip.bind(this));
  }

  actionIcon(action) {
    if (!action.default_icon) {
      return <i className="mdi mdi-lock" />;
    }

    let biggestSize = 0;
    for (const size in action.default_icon) {
      if (size > biggestSize) {
        biggestSize = size;
      }
    }

    const path = `${window.ferdi.features.extensions.extensionsPath}/${action.id}/${action.default_icon[biggestSize]}`;

    return (
      <img
        src={path}
        alt="Action icon"
        style={{
          height: 25,
          width: 25,
          objectFit: 'contain',
        }}
      />
    );
  }

  render() {
    const {
      stores,
    } = this.props;

    const {
      openedPopup,
      popupTitle,
    } = this.state;

    const browserActions = stores.extensions ? stores.extensions.browserActions : [];

    return (
      <>
        {browserActions.map(action => (
          <button
            type="button"
            className="sidebar__button"
            onClick={() => {
              const popupUrl = `${window.ferdi.features.extensions.extensionsPath}/${action.id}/${action.default_popup}`;

              if (openedPopup === popupUrl) {
                // Close popup
                this.setState({
                  openedPopup: false,
                });
              } else {
                this.setState({
                  openedPopup: popupUrl,
                  popupTitle: action.default_title,
                });
              }
            }}
            data-tip={action.name}
            key={action.id}
          >
            {this.actionIcon(action)}
          </button>
        ))}

        {this.state.tooltipEnabled && (
          <ReactTooltip place="right" type="dark" effect="solid" />
        )}
        {openedPopup && (
          <Popup path={openedPopup} title={popupTitle} />
        )}
      </>
    );
  }
}
