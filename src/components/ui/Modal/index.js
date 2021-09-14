import React, { Component } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import injectCSS from 'react-jss';
import { Icon } from '@meetfranz/ui';

import { mdiClose } from '@mdi/js';
import styles from './styles';

// ReactModal.setAppElement('#root');

@injectCSS(styles)
class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    portal: PropTypes.string,
    close: PropTypes.func.isRequired,
    shouldCloseOnOverlayClick: PropTypes.bool,
    showClose: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    portal: 'modal-portal',
    shouldCloseOnOverlayClick: false,
    showClose: true,
  };

  render() {
    const {
      children,
      className,
      classes,
      isOpen,
      portal,
      close,
      shouldCloseOnOverlayClick,
      showClose,
    } = this.props;

    return (
      <ReactModal
        isOpen={isOpen}
        className={classnames({
          [`${classes.modal}`]: true,
          [`${className}`]: className,
        })}
        portalClassName={classes.component}
        overlayClassName={classes.overlay}
        portal={portal}
        onRequestClose={close}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        appElement={document.querySelector('#root')}
      >
        {showClose && close && (
          <button type="button" className={classes.close} onClick={close}>
            <Icon icon={mdiClose} size={1.5} />
          </button>
        )}
        <div className={classes.content}>{children}</div>
      </ReactModal>
    );
  }
}

export default Modal;
