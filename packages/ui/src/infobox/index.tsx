import { mdiClose } from '@mdi/js';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { Icon } from '..';
import { Theme } from '../../../theme';

interface IProps {
  icon?: string;
  type?: string;
  dismissable?: boolean;
  onDismiss?: () => void;
  onUnmount?: () => void;
  ctaOnClick?: () => void;
  ctaLabel?: string;
  children: React.ReactNode;
  className: string;
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
const useStyles = createUseStyles((theme: Theme) => ({
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
}));

export const Infobox = ({
  icon,
  type = 'primary',
  dismissable = false,
  onDismiss = () => {},
  onUnmount = () => {},
  ctaOnClick = () => {},
  ctaLabel = '',
  children,
  className,
}: IProps) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const classes = useStyles();

  const dismiss = () => {
    setIsDismissing(true);

    if (onDismiss) {
      onDismiss();
    }

    setTimeout(() => {
      setDismissed(true);
    }, 3000);
  };

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      if (onUnmount) {
        onUnmount();
      }
    };
  }, [onUnmount]);

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
          <button type="button" onClick={dismiss} className={classes.close}>
            <Icon icon={mdiClose} />
          </button>
        )}
      </div>
    </div>
  );
};
