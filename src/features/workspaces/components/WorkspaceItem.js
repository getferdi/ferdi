import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';

import Workspace from '../models/Workspace';

const styles = theme => ({
  row: {
    height: theme.workspaces.settings.listItems.height,
    borderBottom: `1px solid ${theme.workspaces.settings.listItems.borderColor}`,
    '&:hover': {
      background: theme.workspaces.settings.listItems.hoverBgColor,
    },
  },
  columnName: {},
});

@injectSheet(styles)
@observer
class WorkspaceItem extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    workspace: PropTypes.instanceOf(Workspace).isRequired,
    onItemClick: PropTypes.func.isRequired,
  };

  render() {
    const { classes, workspace, onItemClick } = this.props;

    return (
      <tr className={classes.row}>
        <td onClick={() => onItemClick(workspace)}>{workspace.name}</td>
      </tr>
    );
  }
}

export default WorkspaceItem;
