window.chrome.tabs = {
  query: options => [
    {
      id: 1,
      windowId: 0,
      active: true,
      pinned: false,
      incognito: false,
      url: 'https://google.com',
      options,
    },
  ],

};
