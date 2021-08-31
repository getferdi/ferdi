chrome.runtime = {
  lastError: false,
  sendMessage: (data, callback) => {
    callback(false);
  },
  getManifest: () => ({
    version: '1.0.0',
  }),
  getURL: path => window.location.href.split('/').slice(0, -1).join('/') + path,
};

// sendMessage(
//   {
//     source,
//     func,
//     args: args ? (Array.isArray(args) ? args : [args]) : [],
//   },
//   (response) => {
//     chrome.runtime.lastError
//       ? reject(new Error(chrome.runtime.lastError.message))
//       : resolve(response)
//   }
// )
