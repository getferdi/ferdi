import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import classnames from 'classnames';

import { oneOrManyChildElements } from '../../prop-types';
import { matchRoute } from '../../helpers/routing-helpers';
import { openExternalUrl } from '../../helpers/url-helpers';

// TODO: create container component for this component
@inject('stores')
@observer
class Link extends Component {
  onClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
    } else if (this.props.target === '_blank') {
      e.preventDefault();
      openExternalUrl(this.props.to, true);
    }
    // Note: if neither of the above, then let the other onClick handlers process it
  }

  render() {
    const {
      children,
      stores,
      to,
      className,
      activeClassName,
      strictFilter,
      style,
    } = this.props;
    const { router } = stores;

    let filter = `${to}(*action)`;
    if (strictFilter) {
      filter = `${to}`;
    }

    const match = matchRoute(filter, router.location.pathname);

    const linkClasses = classnames({
      [`${className}`]: true,
      [`${activeClassName}`]: match,
      'is-disabled': this.props.disabled,
    });

    return (
      <a
        href={router.history.createHref(to)}
        className={linkClasses}
        style={style}
        onClick={e => this.onClick(e)}
      >
        {children}
      </a>
    );
  }
}

Link.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([oneOrManyChildElements, PropTypes.string])
    .isRequired,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  strictFilter: PropTypes.bool,
  target: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

Link.wrappedComponent.defaultProps = {
  className: '',
  activeClassName: '',
  strictFilter: false,
  disabled: false,
  target: '',
  style: {},
};

export default Link;
