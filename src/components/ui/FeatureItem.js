import React from 'react';
import injectSheet from 'react-jss';
import { Icon } from '@meetfranz/ui';
import classnames from 'classnames';
import { mdiCheckCircle } from '@mdi/js';

const styles = (theme) => ({
  featureItem: {
    borderBottom: [1, 'solid', theme.defaultContentBorder],
    padding: [8, 0],
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
  },
  featureIcon: {
    fill: theme.brandSuccess,
    marginRight: 10,
  },
});

export const FeatureItem = injectSheet(styles)(({
  classes, className, name, icon,
}) => (
  <li className={classnames({
    [classes.featureItem]: true,
    [className]: className,
  })}
  >
    {icon ? (
      <span className={classes.featureIcon}>{icon}</span>
    ) : (
      <Icon icon={mdiCheckCircle} className={classes.featureIcon} size={1.5} />
    )}
    {name}
  </li>
));

export default FeatureItem;
