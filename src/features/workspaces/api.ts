import { pick } from 'lodash';
import { sendAuthRequest } from '../../api/utils/auth';
import Request from '../../stores/lib/Request';
import Workspace from './models/Workspace';
import apiBase from '../../api/apiBase';

const debug = require('debug')('Ferdi:feature:workspaces:api');

export const workspaceApi = {
  getUserWorkspaces: async () => {
    const url = `${apiBase()}/workspace`;
    debug('getUserWorkspaces GET', url);
    const result = await sendAuthRequest(url, { method: 'GET' });
    debug('getUserWorkspaces RESULT', result);
    if (!result.ok) {
      throw new Error("Couldn't getUserWorkspaces");
    }
    const workspaces = await result.json();
    return workspaces.map(data => new Workspace(data));
  },

  createWorkspace: async name => {
    const url = `${apiBase()}/workspace`;
    const options = {
      method: 'POST',
      body: JSON.stringify({ name }),
    };
    debug('createWorkspace POST', url, options);
    const result = await sendAuthRequest(url, options);
    debug('createWorkspace RESULT', result);
    if (!result.ok) {
      throw new Error("Couldn't createWorkspace");
    }
    return new Workspace(await result.json());
  },

  deleteWorkspace: async workspace => {
    const url = `${apiBase()}/workspace/${workspace.id}`;
    debug('deleteWorkspace DELETE', url);
    const result = await sendAuthRequest(url, { method: 'DELETE' });
    debug('deleteWorkspace RESULT', result);
    if (!result.ok) {
      throw new Error("Couldn't deleteWorkspace");
    }
    return true;
  },

  updateWorkspace: async workspace => {
    const url = `${apiBase()}/workspace/${workspace.id}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify(pick(workspace, ['name', 'services'])),
    };
    debug('updateWorkspace UPDATE', url, options);
    const result = await sendAuthRequest(url, options);
    debug('updateWorkspace RESULT', result);
    if (!result.ok) {
      throw new Error("Couldn't updateWorkspace");
    }
    return new Workspace(await result.json());
  },
};

export const getUserWorkspacesRequest = new Request(
  workspaceApi,
  'getUserWorkspaces',
);
export const createWorkspaceRequest = new Request(
  workspaceApi,
  'createWorkspace',
);
export const deleteWorkspaceRequest = new Request(
  workspaceApi,
  'deleteWorkspace',
);
export const updateWorkspaceRequest = new Request(
  workspaceApi,
  'updateWorkspace',
);

export const resetApiRequests = () => {
  getUserWorkspacesRequest.reset();
  createWorkspaceRequest.reset();
  deleteWorkspaceRequest.reset();
  updateWorkspaceRequest.reset();
};
