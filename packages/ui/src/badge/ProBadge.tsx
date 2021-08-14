import { mdiStar } from '@mdi/js';
import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { Badge, Icon } from '..';
import { Theme } from '../../../theme';

interface IProps {
  badgeClasses?: string;
  iconClasses?: string;
  inverted?: boolean;
  className?: string;
}

const useStyles = createUseStyles((theme: Theme) => ({
  badge: {
    height: 'auto',
    padding: [4, 6, 2, 7],
    borderRadius: theme.borderRadiusSmall,
  },
  invertedBadge: {
    background: theme.styleTypes.primary.contrast,
    color: theme.styleTypes.primary.accent,
  },
  icon: {
    fill: theme.styleTypes.primary.contrast,
  },
  invertedIcon: {
    fill: theme.styleTypes.primary.accent,
  },
}));

export const ProBadge = ({
  badgeClasses,
  iconClasses,
  inverted,
  className,
}: IProps) => {
  const classes = useStyles();

  return (
    <Badge
      type="primary"
      className={classnames([
        classes.badge,
        inverted && classes.invertedBadge,
        badgeClasses,
        className,
      ])}
    >
      <Icon
        icon={mdiStar}
        className={classnames([
          classes.icon,
          inverted && classes.invertedIcon,
          iconClasses,
        ])}
      />
    </Badge>
  );
};
