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
const { spawn } = require('child_process');
const { argv } = require('yargs');

const colors = require('colors');

// Build utils
const utils = require('./utils')();

// Create logger
require('../logger');

/**
 * Organize exported build directories.
 * @function
 * @param {Array} paths - List of build directories
 *
 */
const postBuild = paths => {
  paths.forEach(buildPath => {
    const binPath = path.join(__dirname, '..', buildPath);
    // Ensure is directory
    if (fs.statSync(binPath).isDirectory()) {
      const indexPathOg = path.join(binPath, 'admin/secure/index.html');
      const indexPathNew = path.join(binPath, 'index.html');
      const jsPathOg = path.join(binPath, 'admin/secure/js');
      const jsPathNew = path.join(binPath, 'admin/js');

      fs.renameSync(indexPathOg, indexPathNew);
      fs.renameSync(jsPathOg, jsPathNew);
    }
  });
};

/**
 * Send either all of specified app packages to CMS front-end generator.
 * @module
 */
module.exports = (() => {
  let packages = [];

  /* 
      Handle app arguments
      */
  // List all package names in repo
  if (argv.list) {
    utils.GetPackagesData(true);
    return;
  }
  // Retrieve info and build only packages specified, or all if not
  packages = utils.GetPackagesData(false, argv.packages);

  // For all packages...
  const keys = Object.keys(packages);
  // Track exported builds done via their build folders, for post-build scripting
  const exportsDone = [];

  keys.forEach(async pkgKey => {
    const pkg = packages[pkgKey];
    const outDir = `./../../bin/${pkgKey}`;
    try {
      // Call CMS distributable static generator for the current package
      const child = spawn('npm', [
        'run',
        'build',
        '--',
        `--entry=${__dirname}/generator.js`,
        `--out=${outDir}`,
        `--app=${pkgKey}`,
        `--allApps=${keys}`
      ]);

      child.stdout.on('data', chunk => {
        global.logger.info(chunk);
      });

      child.on('error', chunk => {
        global.logger.error(chunk);
      });

      child.on('exit', (err, info) => {
        if (err !== 0)
          global.logger.error(
            `⛔ Uncaught error for ${colors.yellow(pkg.name)} process.`
          );
        else {
          global.logger.info(
            `🍺 CMS bundle exported for ${colors.yellow(pkg.name)}.`
          );
          exportsDone.push(outDir);

          if (exportsDone.length === keys.length) {
            postBuild(exportsDone);
            global.logger.info(
              `✨  All bundles done, organizing directories.  ✨`
            );
          }
        }
      });
    } catch (err) {
      global.logger.error(err);
    }
  });
})();
