
/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class WorkspaceSchema extends Schema {
  up() {
    this.create('workspaces', (table) => {
      table.increments();
      table.string('workspaceId', 80).notNullable().unique();
      table.string('name', 80).notNullable();
      table.integer('order');
      table.json('services');
      table.json('data');
      table.timestamps();
    });
  }

  down() {
    this.drop('workspaces');
  }
}

module.exports = WorkspaceSchema;
