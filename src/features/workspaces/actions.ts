import PropTypes from 'prop-types';
import Workspace from './models/Workspace';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

export const workspaceActions = createActionsFromDefinitions(
  {
    edit: {
      workspace: PropTypes.instanceOf(Workspace).isRequired,
    },
    create: {
      name: PropTypes.string.isRequired,
    },
    delete: {
      workspace: PropTypes.instanceOf(Workspace).isRequired,
    },
    update: {
      workspace: PropTypes.instanceOf(Workspace).isRequired,
    },
    activate: {
      workspace: PropTypes.instanceOf(Workspace).isRequired,
    },
    deactivate: {},
    toggleWorkspaceDrawer: {},
    openWorkspaceSettings: {},
    toggleKeepAllWorkspacesLoadedSetting: {},
  },
  PropTypes.checkPropTypes,
);

export default workspaceActions;
