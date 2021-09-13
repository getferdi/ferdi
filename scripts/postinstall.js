const { exec } = require('child_process');

// eslint-disable-next-line no-console
const log = (err, stdout, stderr) => console.log(err || stdout || stderr);

if (!process.env.BUNDLING) {
  exec('npx lerna run build', log);
}
