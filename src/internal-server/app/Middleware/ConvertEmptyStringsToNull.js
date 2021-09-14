class ConvertEmptyStringsToNull {
  async handle({ request }, next) {
    if (Object.keys(request.body).length > 0) {
      request.body = Object.assign(
        ...Object.keys(request.body).map(key => ({
          [key]: request.body[key] !== '' ? request.body[key] : null,
        })),
      );
    }

    await next();
  }
}

module.exports = ConvertEmptyStringsToNull;
