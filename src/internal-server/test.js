const server = require('./start');
const path = require('path');
const fs = require('fs-extra');

const dummyUserFolder = path.join(__dirname, 'user_data');

fs.ensureDirSync(dummyUserFolder);

server(dummyUserFolder, 45568);
