/**
 * Controller for routes with static responses
 */

import { DEFAULT_FEATURES_CONFIG } from '../../../../config';

// TODO: This endpoint and associated code needs to be remoeved as cleanup
class StaticController {
  // Enable all features
  features({ response }) {
    return response.send(DEFAULT_FEATURES_CONFIG);
  }

  // Return an empty array
  emptyArray({ response }) {
    return response.send([]);
  }
}

export default StaticController;
