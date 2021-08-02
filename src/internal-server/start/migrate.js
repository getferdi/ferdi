/**
 * Migrate server database to work with current Ferdi version
 */
const Database = use('Database');
const User = use('App/Models/User');

const migrateLog = (text) => {
  console.log('\x1b[36m%s\x1b[0m', 'Ferdi Migration:', '\x1b[0m', text);
};

module.exports = async () => {
  migrateLog('🧙‍  Running database migration wizard');

  // Make sure user table exists
  await Database.raw('CREATE TABLE IF NOT EXISTS `users` (`id` integer not null primary key autoincrement, `settings` text, `created_at` datetime, `updated_at` datetime);');

  const user = await User.find(1);
  let settings;
  if (!user) {
    migrateLog('🎩  Migrating from old Ferdi version as user doesn\'t exist');

    // Create new user
    await Database.raw('INSERT INTO  "users" ("id") VALUES (\'1\');');
  } else {
    settings = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings;
  }

  if (!settings || !settings.db_version || settings.db_version !== process.env.FERDI_VERSION) {
    const srcVersion = settings && settings.db_version ? settings.db_version : '5.4.0-beta.2';
    migrateLog(`🔮  Migrating table from ${srcVersion} to ${process.env.FERDI_VERSION}`);

    // Migrate database to current Ferdi version
    // Currently no migrations

    // Update version number in database
    if (!settings) settings = {};
    settings.db_version = process.env.FERDI_VERSION;
    const newUser = await User.find(1); // Fetch user again as we might have only just created it
    newUser.settings = JSON.stringify(settings);
    await newUser.save();
  } else {
    migrateLog('🔧  Nothing to migrate, already on the newest version');
  }
};
