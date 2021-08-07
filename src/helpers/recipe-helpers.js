import { parse } from 'path';
import { userDataRecipesPath } from '../environment';

export function getRecipeDirectory(id = '') {
  return userDataRecipesPath(id);
}

export function getDevRecipeDirectory(id = '') {
  return userDataRecipesPath('dev', id);
}

export function loadRecipeConfig(recipeId) {
  try {
    const configPath = `${recipeId}/package.json`;
    // Delete module from cache
    delete require.cache[require.resolve(configPath)];

    // eslint-disable-next-line
    let config = require(configPath);

    const moduleConfigPath = require.resolve(configPath);
    config.path = parse(moduleConfigPath).dir;

    return config;
  } catch (e) {
    console.error(e);
    return null;
  }
}

module.paths.unshift(
  getDevRecipeDirectory(),
  getRecipeDirectory(),
);
