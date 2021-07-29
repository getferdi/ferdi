import classnames from 'classnames';
import React, { Component } from 'react';
import injectStyle from 'react-jss';
import { IWithStyle } from '../typings/generic';

interface IProps extends IWithStyle {
  children: React.ReactNode;
  className?: string;
  identifier: string;
  noMargin?: boolean;
}

const styles = {
  container: {
    marginBottom: (props: IProps) => (props.noMargin ? 0 : 20),
  },
};

class WrapperComponent extends Component<IProps> {
  render() {
    const { children, classes, className, identifier } = this.props;

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
  }
}

export const Wrapper = injectStyle(styles)(WrapperComponent);
