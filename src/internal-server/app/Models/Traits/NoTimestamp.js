class NoTimestamp {
  register(Model) {
    Object.defineProperties(Model, {
      createdAtColumn: {
        get: () => null,
      },
      updatedAtColumn: {
        get: () => null,
      },
    });
  }
}

module.exports = NoTimestamp;
