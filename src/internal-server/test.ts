import path from 'path';
import fs from 'fs-extra';
import { server } from './start';

const dummyUserFolder = path.join(__dirname, 'user_data');

fs.ensureDirSync(dummyUserFolder);

server(dummyUserFolder, 45_568);
