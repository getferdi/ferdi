import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';
import ReactLoader from 'react-loader';

interface IProps {
  className?: string;
  color?: string;
}

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    height: 60,
  },
});

export const Loader = ({ className, color }: IProps) => {
  const classes = useStyles();
  // const theme = useTheme();

  return (
    <div
      className={classnames({
        [classes.container]: true,
        [`${className}`]: className,
      })}
      data-type="franz-loader"
    >
      <ReactLoader
        loaded={false}
        width={4}
        scale={0.75}
        color={color}
        // color={color || theme.colorText}
        // parentClassName={classes.loader}
      />
    </div>
  );
};
