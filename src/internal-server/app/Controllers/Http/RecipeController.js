const Recipe = use('App/Models/Recipe');
const Drive = use('Drive');
const { validateAll } = use('Validator');
const Env = use('Env');

const fetch = require('node-fetch');
const debug = require('debug')('Ferdi:internalServer:RecipeController');
const { LIVE_FERDI_API } = require('../../../../config');
const { API_VERSION } = require('../../../../environment');

const RECIPES_URL = `${LIVE_FERDI_API}/${API_VERSION}/recipes`;

class RecipeController {
  // List official and custom recipes
  async list({ response }) {
    const officialRecipes = JSON.parse(await (await fetch(RECIPES_URL)).text());
    const customRecipesArray = (await Recipe.all()).rows;
    const customRecipes = customRecipesArray.map(recipe => ({
      id: recipe.recipeId,
      name: recipe.name,
      ...JSON.parse(recipe.data),
    }));

    const recipes = [...officialRecipes, ...customRecipes];

    return response.send(recipes);
  }

  // Search official and custom recipes
  async search({ request, response }) {
    // Validate user input
    const validation = await validateAll(request.all(), {
      needle: 'required',
    });
    if (validation.fails()) {
      return response.status(401).send({
        message: 'Please provide a needle',
        messages: validation.messages(),
        status: 401,
      });
    }

    const needle = request.input('needle');

    // Get results
    let results;

    if (needle === 'ferdi:custom') {
      const dbResults = (await Recipe.all()).toJSON();
      results = dbResults.map(recipe => ({
        id: recipe.recipeId,
        name: recipe.name,
        ...JSON.parse(recipe.data),
      }));
    } else {
      let remoteResults = [];
      // eslint-disable-next-line eqeqeq
      if (Env.get('CONNECT_WITH_FRANZ') == 'true') {
        // eslint-disable-line eqeqeq
        remoteResults = JSON.parse(
          await (
            await fetch(
              `${RECIPES_URL}/search?needle=${encodeURIComponent(needle)}`,
            )
          ).text(),
        );
      }

      debug('remoteResults:', remoteResults);

      const localResultsArray = (
        await Recipe.query().where('name', 'LIKE', `%${needle}%`).fetch()
      ).toJSON();
      const localResults = localResultsArray.map(recipe => ({
        id: recipe.recipeId,
        name: recipe.name,
        ...JSON.parse(recipe.data),
      }));

      debug('localResults:', localResults);

      results = [...localResults, ...(remoteResults || [])];
    }

    return response.send(results);
  }

  // Download a recipe
  async download({ response, params }) {
    // Validate user input
    const validation = await validateAll(params, {
      recipe: 'required|accepted',
    });
    if (validation.fails()) {
      return response.status(401).send({
        message: 'Please provide a recipe ID',
        messages: validation.messages(),
        status: 401,
      });
    }

    const service = params.recipe;

    // Check for invalid characters
    if (/\.+/.test(service) || /\/+/.test(service)) {
      return response.send('Invalid recipe name');
    }

    // Check if recipe exists in recipes folder
    if (await Drive.exists(`${service}.tar.gz`)) {
      return response.send(await Drive.get(`${service}.tar.gz`));
    }
    // eslint-disable-next-line eqeqeq
    if (Env.get('CONNECT_WITH_FRANZ') == 'true') {
      // eslint-disable-line eqeqeq
      return response.redirect(`${RECIPES_URL}/download/${service}`);
    }
    return response.status(400).send({
      message: 'Recipe not found',
      code: 'recipe-not-found',
    });
  }
}

module.exports = RecipeController;
