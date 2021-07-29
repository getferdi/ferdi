import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import ServiceModel from '../../models/Service';

const styles = (theme) => ({
  root: {
    height: 'auto',
  },
  icon: {
    width: theme.serviceIcon.width,
  },
  isCustomIcon: {
    width: theme.serviceIcon.isCustom.width,
    border: theme.serviceIcon.isCustom.border,
    borderRadius: theme.serviceIcon.isCustom.borderRadius,
  },
  isDisabled: {
    filter: 'grayscale(100%)',
    opacity: '.5',
  },
});

@injectSheet(styles) @observer
class ServiceIcon extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const {
      classes,
      className,
      service,
    } = this.props;

    return (
      <div
        className={classnames([
          classes.root,
          className,
        ])}
      >
        <img
          src={service.icon}
          className={classnames([
            classes.icon,
            service.isEnabled ? null : classes.isDisabled,
            service.hasCustomIcon ? classes.isCustomIcon : null,
          ])}
          alt=""
        />
      </div>
    );
  }
}

export default ServiceIcon;
