// TODO: Save storage data somewhere save instead of using the localStorage
const getDataFromLocal = name => (localStorage[name] ? JSON.parse(localStorage[name]) : undefined);

const storageProvider = {
  get: (name, callback) => {
    let keys = name;
    if (typeof name === 'string') {
      keys = [name];
    }

    const data = {};

    for (const key in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, key)) {
        data[key] = getDataFromLocal(key);
      }
    }

    callback(data);
  },
  set: (data, callback = (() => {})) => {
    for (const name in data) {
      if (Object.prototype.hasOwnProperty.call(data, name)) {
        localStorage[name] = data[name];
      }
    }
    callback();
  },
};

window.chrome.storage = {
  sync: storageProvider,
  local: storageProvider,
};
