import { mdiClose } from '@mdi/js';
import { Theme } from '@meetfranz/theme';
import classnames from 'classnames';
import React, { Component } from 'react';
import injectStyle from 'react-jss';

import { Icon } from '..';
import { IWithStyle } from '../typings/generic';

interface IProps extends IWithStyle {
  icon?: string;
  type?: string;
  dismissable?: boolean;
  onDismiss?: () => void;
  onUnmount?: () => void;
  ctaOnClick?: () => void;
  ctaLabel?: string;
  ctaLoading?: boolean;
  children: React.ReactNode;
  className: string;
}

interface IState {
  isDismissing: boolean;
  dismissed: boolean;
}

const buttonStyles = (theme: Theme) => {
  const styles = {};
  Object.keys(theme.styleTypes).map(style => {
    Object.assign(styles, {
      [style]: {
        background: theme.styleTypes[style].accent,
        color: theme.styleTypes[style].contrast,
        border: theme.styleTypes[style].border,

        '& svg': {
          fill: theme.styleTypes[style].contrast,
        },
      },
    });
  });

  return styles;
};

const styles = (theme: Theme) => ({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    height: 'auto',
    marginBottom: 30,
  },
  infobox: {
    alignItems: 'center',
    borderRadius: theme.borderRadiusSmall,
    display: 'flex',
    height: 'auto',
    padding: '15px 20px',
    top: 0,
    transition: 'all 0.5s',
    opacity: 1,
  },
  dismissing: {
    // position: 'absolute',
    marginTop: -100,
    opacity: 0,
  },
  content: {
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  close: {
    color: (props: IProps) =>
      theme.styleTypes[props.type ? props.type : 'primary'].contrast,
    marginRight: -5,
    border: 0,
    background: 'none',
  },
  cta: {
    borderColor: (props: IProps) =>
      theme.styleTypes[props.type ? props.type : 'primary'].contrast,
    borderRadius: theme.borderRadiusSmall,
    borderStyle: 'solid',
    borderWidth: 1,
    background: 'none',
    color: (props: IProps) =>
      theme.styleTypes[props.type ? props.type : 'primary'].contrast,
    marginLeft: 15,
    padding: [4, 10],
    fontSize: theme.uiFontSize,
    transition: 'opacity 0.3s',

    '&:hover': {
      opacity: 0.6,
    },
  },
  ...buttonStyles(theme),
});

class InfoboxComponent extends Component<IProps, IState> {
  public static defaultProps = {
    type: 'primary',
    dismissable: false,
    ctaOnClick: () => {},
    onDismiss: () => {},
    ctaLabel: '',
    ctaLoading: false,
  };

  state = {
    isDismissing: false,
    dismissed: false,
  };

  dismiss() {
    const { onDismiss } = this.props;

    this.setState({
      isDismissing: true,
    });

    if (onDismiss) {
      onDismiss();
    }

    setTimeout(() => {
      this.setState({
        dismissed: true,
      });
    }, 3000);
  }

  componentWillUnmount(): void {
    const { onUnmount } = this.props;
    if (onUnmount) onUnmount();
  }

  render() {
    const {
      classes,
      children,
      icon,
      type,
      ctaLabel,
      ctaOnClick,
      dismissable,
      className,
    } = this.props;

    const { isDismissing, dismissed } = this.state;

    if (dismissed) {
      return null;
    }

    return (
      <div
        className={classnames({
          [classes.wrapper]: true,
          [`${className}`]: className,
        })}
      >
        <div
          className={classnames({
            [classes.infobox]: true,
            [classes[`${type}`]]: type,
            [classes.dismissing]: isDismissing,
          })}
          data-type="franz-infobox"
        >
          {icon && <Icon icon={icon} className={classes.icon} />}
          <div className={classes.content}>{children}</div>
          {ctaLabel && (
            <button className={classes.cta} onClick={ctaOnClick} type="button">
              {ctaLabel}
            </button>
          )}
          {dismissable && (
            <button
              type="button"
              onClick={this.dismiss.bind(this)}
              className={classes.close}
            >
              <Icon icon={mdiClose} />
            </button>
          )}
        </div>
      </div>
    );
  }
}

export const Infobox = injectStyle(styles)(InfoboxComponent);
