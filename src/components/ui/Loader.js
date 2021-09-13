import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';

import { oneOrManyChildElements } from '../../prop-types';

@inject('stores')
@observer
class LoaderComponent extends Component {
  static propTypes = {
    children: oneOrManyChildElements,
    loaded: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.string,
    stores: PropTypes.shape({
      settings: PropTypes.shape({
        app: PropTypes.shape({
          accentColor: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    children: null,
    loaded: false,
    className: '',
    color: 'ACCENT',
  };

  render() {
    const { children, loaded, className } = this.props;

    const color =
      this.props.color !== 'ACCENT'
        ? this.props.color
        : this.props.stores.settings.app.accentColor;

    return (
      <Loader
        loaded={loaded}
        // lines={10}
        width={4}
        scale={0.6}
        color={color}
        component="span"
        className={className}
      >
        {children}
      </Loader>
    );
  }
}

export default LoaderComponent;
