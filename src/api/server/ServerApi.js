/* eslint-disable global-require */
import { join } from 'path';
import tar from 'tar';
import {
  readdirSync,
  statSync,
  writeFileSync,
  copySync,
  ensureDirSync,
  pathExistsSync,
  readJsonSync,
  removeSync,
} from 'fs-extra';
import fetch from 'electron-fetch';

import ServiceModel from '../../models/Service';
import RecipePreviewModel from '../../models/RecipePreview';
import RecipeModel from '../../models/Recipe';
import NewsModel from '../../models/News';
import UserModel from '../../models/User';

import { sleep } from '../../helpers/async-helpers';

import { SERVER_NOT_LOADED } from '../../config';
import {
  osArch,
  osPlatform,
  asarRecipesPath,
  userDataRecipesPath,
  userDataPath,
  ferdiVersion,
} from '../../environment';
import apiBase from '../apiBase';
import { prepareAuthRequest, sendAuthRequest } from '../utils/auth';

import {
  getRecipeDirectory,
  getDevRecipeDirectory,
  loadRecipeConfig,
} from '../../helpers/recipe-helpers';

import { removeServicePartitionDirectory } from '../../helpers/service-helpers';

const debug = require('debug')('Ferdi:ServerApi');

module.paths.unshift(getDevRecipeDirectory(), getRecipeDirectory());

export default class ServerApi {
  recipePreviews = [];

  recipes = [];

  // User
  async login(email, passwordHash) {
    const request = await sendAuthRequest(
      `${apiBase()}/auth/login`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${window.btoa(`${email}:${passwordHash}`)}`,
        },
      },
      false,
    );
    if (!request.ok) {
      throw request;
    }
    const u = await request.json();

    debug('ServerApi::login resolves', u);
    return u.token;
  }

  async signup(data) {
    const request = await sendAuthRequest(
      `${apiBase()}/auth/signup`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      false,
    );
    if (!request.ok) {
      throw request;
    }
    const u = await request.json();

    debug('ServerApi::signup resolves', u);
    return u.token;
  }

  async inviteUser(data) {
    const request = await sendAuthRequest(`${apiBase()}/invite`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!request.ok) {
      throw request;
    }

    debug('ServerApi::inviteUser');
    return true;
  }

  async retrievePassword(email) {
    const request = await sendAuthRequest(
      `${apiBase()}/auth/password`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      },
      false,
    );
    if (!request.ok) {
      throw request;
    }
    const r = await request.json();

    debug('ServerApi::retrievePassword');
    return r;
  }

  async userInfo() {
    if (apiBase() === SERVER_NOT_LOADED) {
      throw new Error('Server not loaded');
    }

    const request = await sendAuthRequest(`${apiBase()}/me`);
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const user = new UserModel(data);
    debug('ServerApi::userInfo resolves', user);

    return user;
  }

  async updateUserInfo(data) {
    const request = await sendAuthRequest(`${apiBase()}/me`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!request.ok) {
      throw request;
    }
    const updatedData = await request.json();

    const user = Object.assign(updatedData, {
      data: new UserModel(updatedData.data),
    });
    debug('ServerApi::updateUserInfo resolves', user);
    return user;
  }

  async deleteAccount() {
    const request = await sendAuthRequest(`${apiBase()}/me`, {
      method: 'DELETE',
    });
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    debug('ServerApi::deleteAccount resolves', data);
    return data;
  }

  // Services
  async getServices() {
    if (apiBase() === SERVER_NOT_LOADED) {
      throw new Error('Server not loaded');
    }

    const request = await sendAuthRequest(`${apiBase()}/me/services`);
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const services = await this._mapServiceModels(data);
    const filteredServices = services.filter(service => !!service);
    debug('ServerApi::getServices resolves', filteredServices);
    return filteredServices;
  }

  async createService(recipeId, data) {
    const request = await sendAuthRequest(`${apiBase()}/service`, {
      method: 'POST',
      body: JSON.stringify({ recipeId, ...data }),
    });
    if (!request.ok) {
      throw request;
    }
    const serviceData = await request.json();

    if (data.iconFile) {
      const iconData = await this.uploadServiceIcon(
        serviceData.data.id,
        data.iconFile,
      );

      serviceData.data = iconData;
    }

    const service = Object.assign(serviceData, {
      data: await this._prepareServiceModel(serviceData.data),
    });

    debug('ServerApi::createService resolves', service);
    return service;
  }

  async updateService(serviceId, rawData) {
    const data = rawData;

    if (data.iconFile) {
      await this.uploadServiceIcon(serviceId, data.iconFile);
    }

    const request = await sendAuthRequest(`${apiBase()}/service/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!request.ok) {
      throw request;
    }

    const serviceData = await request.json();

    const service = Object.assign(serviceData, {
      data: await this._prepareServiceModel(serviceData.data),
    });

    debug('ServerApi::updateService resolves', service);
    return service;
  }

  async uploadServiceIcon(serviceId, icon) {
    const formData = new FormData();
    formData.append('icon', icon);

    const requestData = prepareAuthRequest({
      method: 'PUT',
      body: formData,
    });

    delete requestData.headers['Content-Type'];

    const request = await window.fetch(
      `${apiBase()}/service/${serviceId}`,
      requestData,
    );

    if (!request.ok) {
      throw request;
    }

    const serviceData = await request.json();

    return serviceData.data;
  }

  async reorderService(data) {
    const request = await sendAuthRequest(`${apiBase()}/service/reorder`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!request.ok) {
      throw request;
    }
    const serviceData = await request.json();
    debug('ServerApi::reorderService resolves', serviceData);
    return serviceData;
  }

  async deleteService(id) {
    const request = await sendAuthRequest(`${apiBase()}/service/${id}`, {
      method: 'DELETE',
    });
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    removeServicePartitionDirectory(id, true);

    debug('ServerApi::deleteService resolves', data);
    return data;
  }

  // Features
  async getDefaultFeatures() {
    const request = await sendAuthRequest(`${apiBase()}/features/default`);
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const features = data;
    debug('ServerApi::getDefaultFeatures resolves', features);
    return features;
  }

  async getFeatures() {
    if (apiBase() === SERVER_NOT_LOADED) {
      throw new Error('Server not loaded');
    }

    const request = await sendAuthRequest(`${apiBase()}/features`);
    if (!request.ok) {
      throw request;
    }
    const data = await request.json();

    const features = data;
    debug('ServerApi::getFeatures resolves', features);
    return features;
  }

  // Recipes
  async getInstalledRecipes() {
    const recipesDirectory = getRecipeDirectory();
    const paths = readdirSync(recipesDirectory).filter(
      file =>
        statSync(join(recipesDirectory, file)).isDirectory() &&
        file !== 'temp' &&
        file !== 'dev',
    );

    this.recipes = paths
      .map(id => {
        // eslint-disable-next-line import/no-dynamic-require
        const Recipe = require(id)(RecipeModel);
        return new Recipe(loadRecipeConfig(id));
      })
      .filter(recipe => recipe.id);

    // eslint-disable-next-line unicorn/prefer-spread
    this.recipes = this.recipes.concat(this._getDevRecipes());

    debug('StubServerApi::getInstalledRecipes resolves', this.recipes);
    return this.recipes;
  }

  async getRecipeUpdates(recipeVersions) {
    const request = await sendAuthRequest(`${apiBase()}/recipes/update`, {
      method: 'POST',
      body: JSON.stringify(recipeVersions),
    });
    if (!request.ok) {
      throw request;
    }
    const recipes = await request.json();
    debug('ServerApi::getRecipeUpdates resolves', recipes);
    return recipes;
  }

  // Recipes Previews
  async getRecipePreviews() {
    const request = await sendAuthRequest(`${apiBase()}/recipes`);
    if (!request.ok) throw request;
    const data = await request.json();
    const recipePreviews = this._mapRecipePreviewModel(data);
    debug('ServerApi::getRecipes resolves', recipePreviews);
    return recipePreviews;
  }

  async getFeaturedRecipePreviews() {
    // TODO: If we are hitting the internal-server, we need to return an empty list, else we can hit the remote server and get the data
    const request = await sendAuthRequest(`${apiBase()}/recipes/popular`);
    if (!request.ok) throw request;

    const data = await request.json();
    const recipePreviews = this._mapRecipePreviewModel(data);
    debug('ServerApi::getFeaturedRecipes resolves', recipePreviews);
    return recipePreviews;
  }

  async searchRecipePreviews(needle) {
    const url = `${apiBase()}/recipes/search?needle=${needle}`;
    const request = await sendAuthRequest(url);
    if (!request.ok) throw request;

    const data = await request.json();
    const recipePreviews = this._mapRecipePreviewModel(data);
    debug('ServerApi::searchRecipePreviews resolves', recipePreviews);
    return recipePreviews;
  }

  async getRecipePackage(recipeId) {
    try {
      const recipesDirectory = userDataRecipesPath();
      const recipeTempDirectory = join(recipesDirectory, 'temp', recipeId);
      const tempArchivePath = join(recipeTempDirectory, 'recipe.tar.gz');

      const internalRecipeFile = asarRecipesPath(`${recipeId}.tar.gz`);

      ensureDirSync(recipeTempDirectory);

      let archivePath;

      if (pathExistsSync(internalRecipeFile)) {
        debug('[ServerApi::getRecipePackage] Using internal recipe file');
        archivePath = internalRecipeFile;
      } else {
        debug('[ServerApi::getRecipePackage] Downloading recipe from server');
        archivePath = tempArchivePath;

        const packageUrl = `${apiBase()}/recipes/download/${recipeId}`;

        const res = await fetch(packageUrl);
        debug('Recipe downloaded', recipeId);
        const buffer = await res.buffer();
        writeFileSync(archivePath, buffer);
      }
      debug(archivePath);

      await sleep(10);

      await tar.x({
        file: archivePath,
        cwd: recipeTempDirectory,
        preservePaths: true,
        unlink: true,
        preserveOwner: false,
        onwarn: x => debug('warn', recipeId, x),
      });

      await sleep(10);

      const { id } = readJsonSync(join(recipeTempDirectory, 'package.json'));
      const recipeDirectory = join(recipesDirectory, id);
      copySync(recipeTempDirectory, recipeDirectory);
      removeSync(recipeTempDirectory);
      removeSync(join(recipesDirectory, recipeId, 'recipe.tar.gz'));

      return id;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  // News
  async getLatestNews() {
    const url = `${apiBase(
      true,
    )}/news?platform=${osPlatform}&arch=${osArch}&version=${ferdiVersion}`;
    const request = await sendAuthRequest(url);
    if (!request.ok) throw request;
    const data = await request.json();
    const news = this._mapNewsModels(data);
    debug('ServerApi::getLatestNews resolves', news);
    return news;
  }

  async hideNews(id) {
    const request = await sendAuthRequest(`${apiBase()}/news/${id}/read`);
    if (!request.ok) throw request;
    debug('ServerApi::hideNews resolves', id);
  }

  // Health Check
  async healthCheck() {
    if (apiBase() === SERVER_NOT_LOADED) {
      throw new Error('Server not loaded');
    }

    const request = await sendAuthRequest(
      `${apiBase(false)}/health`,
      {
        method: 'GET',
      },
      false,
    );
    if (!request.ok) {
      throw request;
    }
    debug('ServerApi::healthCheck resolves');
  }

  async getLegacyServices() {
    const file = userDataPath('settings', 'services.json');

    try {
      const config = readJsonSync(file);

      if (Object.prototype.hasOwnProperty.call(config, 'services')) {
        const services = await Promise.all(
          config.services.map(async s => {
            const service = s;
            const request = await sendAuthRequest(
              `${apiBase()}/recipes/${s.service}`,
            );

            if (request.status === 200) {
              const data = await request.json();
              service.recipe = new RecipePreviewModel(data);
            }

            return service;
          }),
        );

        debug('ServerApi::getLegacyServices resolves', services);
        return services;
      }
    } catch {
      console.error('ServerApi::getLegacyServices no config found');
    }

    return [];
  }

  // Helper
  async _mapServiceModels(services) {
    const recipes = services.map(s => s.recipeId);
    await this._bulkRecipeCheck(recipes);
    /* eslint-disable no-return-await */
    return Promise.all(
      services.map(async service => await this._prepareServiceModel(service)),
    );
    /* eslint-enable no-return-await */
  }

  async _prepareServiceModel(service) {
    let recipe;
    try {
      recipe = this.recipes.find(r => r.id === service.recipeId);

      if (!recipe) {
        console.warn(`Recipe ${service.recipeId} not loaded`);
        return null;
      }

      return new ServiceModel(service, recipe);
    } catch (error) {
      debug(error);
      return null;
    }
  }

  async _bulkRecipeCheck(unfilteredRecipes) {
    // Filter recipe duplicates as we don't need to download 3 Slack recipes
    const recipes = unfilteredRecipes.filter(
      (elem, pos, arr) => arr.indexOf(elem) === pos,
    );

    return Promise.all(
      recipes.map(async recipeId => {
        let recipe = this.recipes.find(r => r.id === recipeId);

        if (!recipe) {
          console.warn(
            `Recipe '${recipeId}' not installed, trying to fetch from server`,
          );

          await this.getRecipePackage(recipeId);

          debug('Rerun ServerAPI::getInstalledRecipes');
          await this.getInstalledRecipes();

          recipe = this.recipes.find(r => r.id === recipeId);

          if (!recipe) {
            console.warn(`Could not load recipe ${recipeId}`);
            return null;
          }
        }

        return recipe;
      }),
    ).catch(error => console.error("Can't load recipe", error));
  }

  _mapRecipePreviewModel(recipes) {
    return recipes
      .map(recipe => {
        try {
          return new RecipePreviewModel(recipe);
        } catch (error) {
          console.error(error);
          return null;
        }
      })
      .filter(recipe => recipe !== null);
  }

  _mapNewsModels(news) {
    return news
      .map(newsItem => {
        try {
          return new NewsModel(newsItem);
        } catch (error) {
          console.error(error);
          return null;
        }
      })
      .filter(newsItem => newsItem !== null);
  }

  _getDevRecipes() {
    const recipesDirectory = getDevRecipeDirectory();
    try {
      const paths = readdirSync(recipesDirectory).filter(
        file =>
          statSync(join(recipesDirectory, file)).isDirectory() &&
          file !== 'temp',
      );

      const recipes = paths
        .map(id => {
          let Recipe;
          try {
            // eslint-disable-next-line import/no-dynamic-require
            Recipe = require(id)(RecipeModel);
            return new Recipe(loadRecipeConfig(id));
          } catch (error) {
            console.error(error);
          }

          return false;
        })
        .filter(recipe => recipe.id)
        .map(data => {
          const recipe = data;

          recipe.icons = {
            svg: `${recipe.path}/icon.svg`,
          };
          recipe.local = true;

          return data;
        });

      return recipes;
    } catch {
      debug('Could not load dev recipes');
      return false;
    }
  }
}
