import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

interface IProps {
  children: React.ReactNode;
  className?: string;
  identifier: string;
  noMargin?: boolean;
}

const useStyles = createUseStyles({
  container: {
    marginBottom: (props: IProps) => (props.noMargin ? 0 : 20),
  },
});

export const Wrapper = (props: IProps) => {
  const { children, className, identifier } = props;

  const classes = useStyles();

  return (
    <div
      className={classnames({
        [`${classes.container}`]: true,
        [`${className}`]: className,
      })}
      data-type={identifier}
    >
      {children}
    </div>
  );
};
