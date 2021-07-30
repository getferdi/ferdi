import classnames from 'classnames';
import React, { Component } from 'react';
import injectStyle from 'react-jss';

import { Theme } from '../../../theme';
import { IWithStyle } from '../typings/generic';

interface IProps extends IWithStyle {
  type: string;
  className?: string;
  children: React.ReactNode;
}

const badgeStyles = (theme: Theme) => {
  const styles = {};
  Object.keys(theme.styleTypes).map((style) => {
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

const styles = (theme: Theme) => ({
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
});

class BadgeComponent extends Component<IProps> {
  public static defaultProps = {
    type: 'primary',
  };

  render() {
    const {
      classes,
      children,
      type,
      className,
    } = this.props;

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
  }
}

export const Badge = injectStyle(styles)(BadgeComponent);
