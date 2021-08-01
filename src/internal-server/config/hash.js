/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Driver
  |--------------------------------------------------------------------------
  |
  | Driver to be used for hashing values. The same driver is used by the
  | auth module too.
  |
  */
  driver: Env.get('HASH_DRIVER', 'bcrypt'),

  /*
  |--------------------------------------------------------------------------
  | Bcrypt
  |--------------------------------------------------------------------------
  |
  | Config related to bcrypt hashing. https://www.npmjs.com/package/bcrypt
  | package is used internally.
  |
  */
  bcrypt: {
    rounds: 10,
  },

  /*
  |--------------------------------------------------------------------------
  | Argon
  |--------------------------------------------------------------------------
  |
  | Config related to argon. https://www.npmjs.com/package/argon2 package is
  | used internally.
  |
  | Since argon is optional, you will have to install the dependency yourself
  |
  |============================================================================
  | npm i argon2
  |============================================================================
  |
  */
  argon: {
    type: 1,
  },
};
