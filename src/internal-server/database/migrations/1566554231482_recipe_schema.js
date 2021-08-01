
/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class RecipeSchema extends Schema {
  up() {
    this.create('recipes', (table) => {
      table.increments();
      table.string('name', 80).notNullable();
      table.string('recipeId', 254).notNullable().unique();
      table.json('data');
      table.timestamps();
    });
  }

  down() {
    this.drop('recipes');
  }
}

module.exports = RecipeSchema;
