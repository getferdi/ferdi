
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

// Run latest database migration
const migrate = require('./migrate');
migrate();

const OnlyAllowFerdi = async ({ request, response }, next) => {
  const version = request.header('X-Franz-Version');
  if (!version) {
    return response.status(403).redirect('/');
  }

  await next();
  return true;
};

// Health: Returning if all systems function correctly
Route.get('health', ({
  response,
}) => response.send({
  api: 'success',
  db: 'success',
})).middleware(OnlyAllowFerdi);

// API is grouped under '/v1/' route
Route.group(() => {
  // User authentification
  Route.post('auth/signup', 'UserController.signup');
  Route.post('auth/login', 'UserController.login');

  // User info
  Route.get('me', 'UserController.me');
  Route.put('me', 'UserController.updateMe');

  // Service info
  Route.post('service', 'ServiceController.create');
  Route.put('service/reorder', 'ServiceController.reorder');
  Route.put('service/:id', 'ServiceController.edit');
  Route.delete('service/:id', 'ServiceController.delete');
  Route.get('me/services', 'ServiceController.list');

  // Recipe store
  Route.get('recipe', 'ServiceController.list');
  Route.post('recipes/update', 'ServiceController.update');
  Route.get('recipes', 'RecipeController.list');
  Route.get('recipes/download/:recipe', 'RecipeController.download');
  Route.get('recipes/search', 'RecipeController.search');
  Route.get('recipes/popular', 'StaticController.popularRecipes');
  Route.get('recipes/update', 'StaticController.emptyArray');

  // Workspaces
  Route.put('workspace/:id', 'WorkspaceController.edit');
  Route.delete('workspace/:id', 'WorkspaceController.delete');
  Route.post('workspace', 'WorkspaceController.create');
  Route.get('workspace', 'WorkspaceController.list');

  // Static responses
  Route.get('features/:mode?', 'StaticController.features');
  Route.get('services', 'StaticController.emptyArray');
  Route.get('news', 'StaticController.emptyArray');
  Route.get('announcements/:version', 'StaticController.announcement');
}).prefix('v1').middleware(OnlyAllowFerdi);

Route.group(() => {
  Route.get('icon/:id', 'ServiceController.icon');
}).prefix('v1');

// Franz account import
Route.post('import', 'UserController.import');
Route.get('import', ({ view }) => view.render('import'));

// Account transfer
Route.get('export', 'UserController.export');
Route.post('transfer', 'UserController.importFerdi');
Route.get('transfer', ({ view }) => view.render('transfer'));

// Index
Route.get('/', ({ view }) => view.render('index'));
