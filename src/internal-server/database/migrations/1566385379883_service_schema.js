/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ServiceSchema extends Schema {
  up() {
    this.create('services', (table) => {
      table.increments();
      table.string('serviceId', 80).notNullable();
      table.string('name', 80).notNullable();
      table.string('recipeId', 254).notNullable();
      table.json('settings');
      table.timestamps();
    });
  }

  down() {
    this.drop('services');
  }
}

module.exports = ServiceSchema;
