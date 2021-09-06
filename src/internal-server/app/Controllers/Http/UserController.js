const User = use('App/Models/User');
const Service = use('App/Models/Service');
const Workspace = use('App/Models/Workspace');
const {
  validateAll,
} = use('Validator');

const btoa = require('btoa');
const fetch = require('node-fetch');
const uuid = require('uuid/v4');
const crypto = require('crypto');
const { DEFAULT_APP_SETTINGS, API_VERSION } = require('../../../../environment');
const { default: userAgent } = require('../../../../helpers/userAgent-helpers');

const apiRequest = (url, route, method, auth) => new Promise((resolve, reject) => {
  try {
    fetch(`${url}/${API_VERSION}/${route}`, {
      method,
      headers: {
        Authorization: `Bearer ${auth}`,
        'User-Agent': userAgent(),
      },
    })
      .then(data => data.json())
      .then(json => resolve(json));
  } catch (e) {
    reject();
  }
});

const LOGIN_SUCCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJGZXJkaSBJbnRlcm5hbCBTZXJ2ZXIiLCJpYXQiOjE1NzEwNDAyMTUsImV4cCI6MjUzMzk1NDE3ODQ0LCJhdWQiOiJnZXRmZXJkaS5jb20iLCJzdWIiOiJmZXJkaUBsb2NhbGhvc3QiLCJ1c2VySWQiOiIxIn0.9_TWFGp6HROv8Yg82Rt6i1-95jqWym40a-HmgrdMC6M';

const DEFAULT_USER_DATA = {
  accountType: 'individual',
  beta: false,
  email: '',
  emailValidated: true,
  features: {},
  firstname: 'Ferdi',
  id: '82c1cf9d-ab58-4da2-b55e-aaa41d2142d8',
  isSubscriptionOwner: true,
  lastname: 'Application',
  locale: DEFAULT_APP_SETTINGS.fallbackLocale,
};

class UserController {
  // Register a new user
  async signup({
    request,
    response,
  }) {
    // Validate user input
    const validation = await validateAll(request.all(), {
      firstname: 'required',
      email: 'required|email',
      password: 'required',
    });
    if (validation.fails()) {
      return response.status(401).send({
        message: 'Invalid POST arguments',
        messages: validation.messages(),
        status: 401,
      });
    }

    return response.send({
      message: 'Successfully created account',
      token: LOGIN_SUCCESS_TOKEN,
    });
  }

  // Login using an existing user
  async login({
    request,
    response,
  }) {
    if (!request.header('Authorization')) {
      return response.status(401).send({
        message: 'Please provide authorization',
        status: 401,
      });
    }

    return response.send({
      message: 'Successfully logged in',
      token: LOGIN_SUCCESS_TOKEN,
    });
  }

  // Return information about the current user
  async me({
    response,
  }) {
    const user = await User.find(1);

    const settings = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings;

    return response.send({
      ...DEFAULT_USER_DATA,
      ...settings || {},
    });
  }

  async updateMe({
    request,
    response,
  }) {
    const user = await User.find(1);

    let settings = user.settings || {};
    if (typeof settings === 'string') {
      settings = JSON.parse(settings);
    }

    const newSettings = {
      ...settings,
      ...request.all(),
    };

    user.settings = JSON.stringify(newSettings);
    await user.save();

    return response.send({
      data: {
        ...DEFAULT_USER_DATA,
        ...newSettings,
      },
      status: [
        'data-updated',
      ],
    });
  }

  async import({
    request,
    response,
  }) {
    // Validate user input
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required',
      server: 'required',
    });
    if (validation.fails()) {
      let errorMessage = 'There was an error while trying to import your account:\n';
      for (const message of validation.messages()) {
        if (message.validation === 'required') {
          errorMessage += `- Please make sure to supply your ${message.field}\n`;
        } else if (message.validation === 'unique') {
          errorMessage += '- There is already a user with this email.\n';
        } else {
          errorMessage += `${message.message}\n`;
        }
      }
      return response.status(401).send(errorMessage);
    }

    const {
      email,
      password,
      server,
    } = request.all();

    const hashedPassword = crypto.createHash('sha256').update(password).digest('base64');

    // Try to get an authentication token
    let token;
    try {
      const basicToken = btoa(`${email}:${hashedPassword}`);

      const rawResponse = await fetch(`${server}/${API_VERSION}/auth/login`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicToken}`,
          'User-Agent': userAgent(),
        },
      });
      const content = await rawResponse.json();

      if (!content.message || content.message !== 'Successfully logged in') {
        const errorMessage = 'Could not login into Franz with your supplied credentials. Please check and try again';
        return response.status(401).send(errorMessage);
      }

      // eslint-disable-next-line prefer-destructuring
      token = content.token;
    } catch (e) {
      return response.status(401).send({
        message: 'Cannot login to Franz',
        error: e,
      });
    }

    // Get user information
    let userInf = false;
    try {
      userInf = await apiRequest(server, 'me', 'GET', token);
    } catch (e) {
      const errorMessage = `Could not get your user info from Franz. Please check your credentials or try again later.\nError: ${e}`;
      return response.status(401).send(errorMessage);
    }
    if (!userInf) {
      const errorMessage = 'Could not get your user info from Franz. Please check your credentials or try again later';
      return response.status(401).send(errorMessage);
    }

    const serviceIdTranslation = {};

    // Import services
    try {
      const services = await apiRequest(server, 'me/services', 'GET', token);

      for (const service of services) {
        await this._createAndCacheService(service, serviceIdTranslation); // eslint-disable-line no-await-in-loop
      }
    } catch (e) {
      const errorMessage = `Could not import your services into our system.\nError: ${e}`;
      return response.status(401).send(errorMessage);
    }

    // Import workspaces
    try {
      const workspaces = await apiRequest(server, 'workspace', 'GET', token);

      for (const workspace of workspaces) {
        await this._createWorkspace(workspace, serviceIdTranslation); // eslint-disable-line no-await-in-loop
      }
    } catch (e) {
      const errorMessage = `Could not import your workspaces into our system.\nError: ${e}`;
      return response.status(401).send(errorMessage);
    }

    return response.send('Your account has been imported. You can now use your Franz account in Ferdi.');
  }

  // Account import/export
  async export({
    // eslint-disable-next-line no-unused-vars
    auth,
    response,
  }) {
    const services = (await Service.all()).toJSON();
    const workspaces = (await Workspace.all()).toJSON();

    const exportData = {
      username: 'Ferdi',
      mail: 'internal@getferdi.com',
      services,
      workspaces,
    };

    return response
      .header('Content-Type', 'application/force-download')
      .header('Content-disposition', 'attachment; filename=export.ferdi-data')
      .send(exportData);
  }

  async importFerdi({
    request,
    response,
  }) {
    const validation = await validateAll(request.all(), {
      file: 'required',
    });
    if (validation.fails()) {
      return response.send(validation.messages());
    }

    let file;
    try {
      file = JSON.parse(request.input('file'));
    } catch (e) {
      return response.send('Could not import: Invalid file, could not read file');
    }

    if (!file || !file.services || !file.workspaces) {
      return response.send('Could not import: Invalid file (2)');
    }

    const serviceIdTranslation = {};

    // Import services
    try {
      for (const service of file.services) {
        await this._createAndCacheService(service, serviceIdTranslation); // eslint-disable-line no-await-in-loop
      }
    } catch (e) {
      const errorMessage = `Could not import your services into our system.\nError: ${e}`;
      return response.send(errorMessage);
    }

    // Import workspaces
    try {
      for (const workspace of file.workspaces) {
        await this._createWorkspace(workspace, serviceIdTranslation); // eslint-disable-line no-await-in-loop
      }
    } catch (e) {
      const errorMessage = `Could not import your workspaces into our system.\nError: ${e}`;
      return response.status(401).send(errorMessage);
    }

    return response.send('Your account has been imported.');
  }

  async _createWorkspace(workspace, serviceIdTranslation) {
    let newWorkspaceId;
    do {
      newWorkspaceId = uuid();
    } while ((await Workspace.query().where('workspaceId', newWorkspaceId).fetch()).rows.length > 0); // eslint-disable-line no-await-in-loop

    if (workspace.services && typeof (workspace.services) === 'string' && workspace.services.length > 0) {
      workspace.services = JSON.parse(workspace.services);
    }
    const services = (workspace.services && typeof (workspace.services) === 'object') ?
      workspace.services.map(oldServiceId => serviceIdTranslation[oldServiceId]) :
      [];
    if (workspace.data && typeof (workspace.data) === 'string' && workspace.data.length > 0) {
      workspace.data = JSON.parse(workspace.data);
    }

    await Workspace.create({
      workspaceId: newWorkspaceId,
      name: workspace.name,
      order: workspace.order,
      services: JSON.stringify(services),
      data: JSON.stringify(workspace.data || {}),
    });
  }

  async _createAndCacheService(service, serviceIdTranslation) {
    // Get new, unused uuid
    let newServiceId;
    do {
      newServiceId = uuid();
    } while ((await Service.query().where('serviceId', newServiceId).fetch()).rows.length > 0); // eslint-disable-line no-await-in-loop

    // store the old serviceId as the key for future lookup
    serviceIdTranslation[service.serviceId] = newServiceId;

    if (service.settings && typeof (service.settings) === 'string' && service.settings.length > 0) {
      service.settings = JSON.parse(service.settings);
    }

    await Service.create({
      serviceId: newServiceId,
      name: service.name,
      recipeId: service.recipeId,
      settings: JSON.stringify(service.settings || {}),
    });
  }
}

module.exports = UserController;
