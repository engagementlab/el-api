/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS static build launcher
 * ==========
 */

const fs = require('fs');
const path = require('path');
// const generator = require('./generator')
const { spawn, exec } = require('child_process');

const appsJson = path.join(__dirname, '../apps.json');

/**
 *
 * @module
 * @param {function}
 */
module.exports = (async () => {
  /**
   *  Load all possible apps from sibling packages (config defined in app.json)
   */
  const appConfigs = fs.readFileSync(appsJson);
  const packages = JSON.parse(appConfigs);

  // Call CMS distributable static generator for the current package
  // exec('keystone build  --entry=generator.js --out=./dist/home');
  console.log(__dirname);
  const child = spawn('npm', [
    'run',
    'build',
    '--',
    `--entry=${__dirname}/generator.js`,
    '--out=./dist/home',
    `--app=${packages[0]}`,
    `--allApps=${packages}`
  ]);
  // const child = spawn('npm run build')

  let data = '';
  for await (const chunk of child.stdout) {
    console.log(`stdout chunk: ${chunk}`);
    data += chunk;
  }
  let error = '';
  for await (const chunk of child.stderr) {
    console.error(`stderr chunk: ${chunk}`);
    error += chunk;
  }
  const exitCode = await new Promise((resolve, reject) => {
    console.log('done');
    child.on('close', resolve);
  });
})();
