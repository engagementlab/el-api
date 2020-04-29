/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS static build launcher
 * ==========
 */

const {
    spawn
} = require('child_process');
const {
    argv
} = require('yargs');

const colors = require('colors');
const utils = require('./utils')();

// Create logger
require('../logger');

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
    keys.forEach(async pkgKey => {
        const pkg = packages[pkgKey];
        try {
            // Call CMS distributable static generator for the current package
            const child = spawn('npm', [
                'run',
                'build',
                '--',
                `--entry=${__dirname}/generator.js`,
                `--out=./../../bin/${pkgKey}`,
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
                    global.logger.error(`⛔ Uncaught error for ${colors.yellow(pkg)} process.`);
                else
                    global.logger.info(`🍺 CMS bundle exported for ${colors.yellow(pkg)}.`);
            });
        } catch (err) {
            global.logger.error(err);
        }
    });
})();