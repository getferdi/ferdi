const BaseExceptionHandler = use('BaseExceptionHandler');

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {object} options.response
   *
   * @return {Promise<void>}
   */
  async handle(error, { response }) {
    if (error.name === 'ValidationException') {
      return response.status(400).send('Invalid arguments');
    }

    return response.status(error.status).send(error.message);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @return {Promise<boolean>}
   */
  async report() {
    return true;
  }
}

module.exports = ExceptionHandler;
