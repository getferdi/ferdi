import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { Theme } from '../../../theme';

interface IProps {
  level?: number;
  className?: string;
  children: string | React.ReactNode;
  id?: string;
}

const useStyles = createUseStyles((theme: Theme) => ({
  headline: {
    fontWeight: 'lighter',
    color: theme.colorText,
    marginTop: 0,
    marginBottom: 10,
    textAlign: 'left',
  },
  h1: {
    fontSize: 30,
    marginTop: 0,
  },
  h2: {
    fontSize: 20,
  },
  h3: {
    fontSize: 18,
  },
  h4: {
    fontSize: theme.uiFontSize,
  },
}));

export const Headline = ({ level, className, children, id }: IProps) => {
  const classes = useStyles();

  return React.createElement(
    `h${level}`,
    {
      id,
      className: classnames({
        [classes.headline]: true,
        [classes[level ? `h${level}` : 'h1']]: true,
        [`${className}`]: className,
      }),
      'data-type': 'franz-headline',
    },
    children,
  );
};

const createH = (level: number) => (props: IProps) =>
  (
    <Headline level={level} {...props}>
      {props.children}
    </Headline>
  );

export const H1 = createH(1);
export const H2 = createH(2);
export const H3 = createH(3);
export const H4 = createH(4);
