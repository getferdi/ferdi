import React from 'react';
import { createUseStyles } from 'react-jss';

import styles from './styles';

interface IProps {
  message: string;
}

const useStyles = createUseStyles(styles);

export const Error = (props: IProps) => {
  const { message } = props;

  const classes = useStyles();

  return <p className={classes.message}>{message}</p>;
};
