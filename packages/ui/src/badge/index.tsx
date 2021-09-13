import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { Theme } from '../../../theme';

interface IProps {
  type: string;
  className?: string;
  children: React.ReactNode;
}

const badgeStyles = (theme: Theme) => {
  const styles = {};
  Object.keys(theme.styleTypes).map(style => {
    Object.assign(styles, {
      [style]: {
        background: theme.styleTypes[style].accent,
        color: theme.styleTypes[style].contrast,
        border: theme.styleTypes[style].border,
      },
    });
  });

  return styles;
};

const useStyles = createUseStyles((theme: Theme) => ({
  badge: {
    display: 'inline-block',
    padding: [3, 8, 4],
    fontSize: theme.badgeFontSize,
    borderRadius: theme.badgeBorderRadius,
    margin: [0, 4],

    '&:first-child': {
      marginLeft: 0,
    },

    '&:last-child': {
      marginRight: 0,
    },
  },
  ...badgeStyles(theme),
}));

export const Badge = (props: IProps) => {
  const { children, type = 'primary', className } = props;

  const classes = useStyles();

  return (
    <div
      className={classnames({
        [classes.badge]: true,
        [classes[type]]: true,
        [`${className}`]: className,
      })}
      data-type="franz-badge"
    >
      {children}
    </div>
  );
};
