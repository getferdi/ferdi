const Workspace = use('App/Models/Workspace');
const {
  validateAll,
} = use('Validator');

const uuid = require('uuid/v4');

class WorkspaceController {
  // Create a new workspace for user
  async create({
    request,
    response,
  }) {
    // Validate user input
    const validation = await validateAll(request.all(), {
      name: 'required',
    });
    if (validation.fails()) {
      return response.status(401).send({
        message: 'Invalid POST arguments',
        messages: validation.messages(),
        status: 401,
      });
    }

    const data = request.all();

    // Get new, unused uuid
    let workspaceId;
    do {
      workspaceId = uuid();
    } while ((await Workspace.query().where('workspaceId', workspaceId).fetch()).rows.length > 0); // eslint-disable-line no-await-in-loop

    const order = (await Workspace.all()).rows.length;

    await Workspace.create({
      workspaceId,
      name: data.name,
      order,
      services: JSON.stringify([]),
      data: JSON.stringify(data),
    });

    return response.send({
      userId: 1,
      name: data.name,
      id: workspaceId,
      order,
      workspaces: [],
    });
  }

  async edit({
    request,
    response,
    params,
  }) {
    // Validate user input
    const validation = await validateAll(request.all(), {
      name: 'required',
      services: 'required|array',
    });
    if (validation.fails()) {
      return response.status(401).send({
        message: 'Invalid POST arguments',
        messages: validation.messages(),
        status: 401,
      });
    }

    const data = request.all();
    const {
      id,
    } = params;

    // Update data in database
    await (Workspace.query()
      .where('workspaceId', id)).update({
      name: data.name,
      services: JSON.stringify(data.services),
    });

    // Get updated row
    const workspace = (await Workspace.query()
      .where('workspaceId', id).fetch()).rows[0];

    return response.send({
      id: workspace.workspaceId,
      name: data.name,
      order: workspace.order,
      services: data.services,
      userId: 1,
    });
  }

  async delete({
    request,
    response,
    params,
  }) {
    // Validate user input
    const validation = await validateAll(params, {
      id: 'required',
    });
    if (validation.fails()) {
      return response.status(401).send({
        message: 'Invalid arguments',
        messages: validation.messages(),
        status: 401,
      });
    }

    const {
      id,
    } = params;

    // Update data in database
    await (Workspace.query()
      .where('workspaceId', id)).delete();

    return response.send({
      message: 'Successfully deleted workspace',
    });
  }

  // List all workspaces a user has created
  async list({
    response,
  }) {
    const workspaces = (await Workspace.all()).rows;
    // Convert to array with all data Franz wants
    let workspacesArray = [];
    if (workspaces) {
      workspacesArray = workspaces.map(workspace => ({
        id: workspace.workspaceId,
        name: workspace.name,
        order: workspace.order,
        services: typeof workspace.services === "string" ? JSON.parse(workspace.services) : workspace.services,
        userId: 1,
      }));
    }


    return response.send(workspacesArray);
  }
}

module.exports = WorkspaceController;
