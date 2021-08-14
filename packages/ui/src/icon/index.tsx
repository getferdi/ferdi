import MdiIcon from '@mdi/react';
import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { Theme } from '../../../theme';

interface IProps {
  icon: string;
  size?: number;
  className?: string;
}
const useStyles = createUseStyles((theme: Theme) => ({
  icon: {
    fill: theme.colorText,
  },
}));

export const Icon = ({ icon, size = 1, className }: IProps) => {
  if (!icon) {
    console.warn('No Icon specified');
  }

  const classes = useStyles();

  return (
    <MdiIcon
      path={icon}
      size={size}
      className={classnames({
        [classes.icon]: true,
        [`${className}`]: className,
      })}
    />
  );
};
