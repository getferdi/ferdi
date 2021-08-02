module.exports = {
  roots: ['src'],
  testPathIgnorePatterns: [
    'node_modules/',
    'recipes/',
    // TODO: Need to unignore tests
    'src/internal-server',
  ],
};
