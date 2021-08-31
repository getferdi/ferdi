window.chrome.extension = {
  getURL: path => window.location.href.split('/').slice(0, -1).join('/') + path,
};
