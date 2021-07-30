import classnames from 'classnames';
import React, { Component } from 'react';
import injectStyle from 'react-jss';

import { Theme } from '../../../theme';
import { IWithStyle, Omit } from '../typings/generic';

interface IProps extends IWithStyle {
  level?: number;
  className?: string;
  children: string | React.ReactNode;
  id?: string;
}

const styles = (theme: Theme) => ({
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
});

class HeadlineComponent extends Component<IProps> {
  render() {
    const { classes, level, className, children, id } = this.props;

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
  }
}

const Headline = injectStyle(styles)(HeadlineComponent);

const createH = (level: number) => (props: Omit<IProps, 'classes' | 'theme'>) =>
  (
    <Headline level={level} {...props}>
      {props.children}
    </Headline>
  );

export const H1 = createH(1);
export const H2 = createH(2);
export const H3 = createH(3);
export const H4 = createH(4);
