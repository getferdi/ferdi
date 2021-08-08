/**
 * Controller for routes with static responses
 */

class StaticController {
  // Enable all features
  features({
    response,
  }) {
    return response.send({
      isServiceProxyEnabled: true,
      isWorkspaceEnabled: true,
      isAnnouncementsEnabled: true,
      isSettingsWSEnabled: false,
      isMagicBarEnabled: true,
      isTodosEnabled: true,
      subscribeURL: 'https://getferdi.com',
      hasInlineCheckout: true,
    });
  }

  // Return an empty array
  emptyArray({
    response,
  }) {
    return response.send([]);
  }

  // Show announcements
  announcement({
    response,
  }) {
    return response.send({});
  }
}

module.exports = StaticController;
