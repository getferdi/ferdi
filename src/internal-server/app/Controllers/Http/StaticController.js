
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
      subscribeURL: "https://getferdi.com",
      hasInlineCheckout: true,
    });
  }

  // Return an empty array
  emptyArray({
    response,
  }) {
    return response.send([]);
  }

  // Return list of popular recipes (copy of the response Franz's API is returning)
  popularRecipes({
    response,
  }) {
    return response.send([{
      // TODO: Why is this list hardcoded?
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'slack',
      name: 'Slack',
      version: '1.0.4',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/slack/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/slack/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'whatsapp',
      name: 'WhatsApp',
      version: '1.0.1',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/whatsapp/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/whatsapp/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'messenger',
      name: 'Messenger',
      version: '1.0.6',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/messenger/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/messenger/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'telegram',
      name: 'Telegram',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/telegram/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/telegram/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'gmail',
      name: 'Gmail',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/gmail/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/gmail/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'skype',
      name: 'Skype',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/skype/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/skype/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'hangouts',
      name: 'Hangouts',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/hangouts/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/hangouts/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'discord',
      name: 'Discord',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/discord/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/discord/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'tweetdeck',
      name: 'Tweetdeck',
      version: '1.0.1',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/tweetdeck/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/tweetdeck/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'hipchat',
      name: 'HipChat',
      version: '1.0.1',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/hipchat/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/hipchat/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'gmailinbox',
      name: 'Inbox by Gmail',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/gmailinbox/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/gmailinbox/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'rocketchat',
      name: 'Rocket.Chat',
      version: '1.0.1',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/rocketchat/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/rocketchat/src/icon.svg',
      },
    }, {
      author: 'Brian Gilbert <brian@briangilbert.net>',
      featured: false,
      id: 'gitter',
      name: 'Gitter',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/gitter/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/gitter/src/icon.svg',
      },
    }, {
      author: 'Stefan Malzner <stefan@adlk.io>',
      featured: false,
      id: 'mattermost',
      name: 'Mattermost',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/mattermost/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/mattermost/src/icon.svg',
      },
    }, {
      author: 'Franz <recipe@meetfranz.com>',
      featured: false,
      id: 'toggl',
      name: 'toggl',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/toggl/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/toggl/src/icon.svg',
      },
    }, {
      author: 'Stuart Clark <stuart@realityloop.com>',
      featured: false,
      id: 'twist',
      name: 'twist',
      version: '1.0.0',
      icons: {
        png: 'https://cdn.franzinfra.com/recipes/dist/twist/src/icon.png',
        svg: 'https://cdn.franzinfra.com/recipes/dist/twist/src/icon.svg',
      },
    }]);
  }

  // Show announcements
  announcement({
    response,
  }) {
    return response.send({});
  }
}

module.exports = StaticController;
