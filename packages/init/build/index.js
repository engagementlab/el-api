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
const {
    spawn
} = require('child_process');
const {
    argv
} = require('yargs');

const colors = require('colors');

// Create logger
require('../logger');

const appsJson = path.join(__dirname, '../apps.json');

/**
 * Get config data for all sibling app packages, or for one if name specified.
 * @function
 * @param {boolean} list - Just list app packages
 * @param {string} [pkgNames] - Names of apps for package info to return (comma-seperated)
 */
const getPackagesData = (list, pkgNames) => {
    const pkgsPath = path.join(__dirname, '../../../packages');
    const dirs = fs.readdirSync(pkgsPath);
    let namesStr = '';
    const namesObj = {};
    // Do not include 'init' package, and only package(s) specified if any
    const dirsFiltered = dirs.filter(name => name !== 'init');
    if (pkgNames) {
        const pkgArr = pkgNames.split(',');
        dirsFiltered.filter(name => pkgArr.indexOf(name) > -1);
    }

    dirsFiltered.forEach(name => {
        if (fs.statSync(path.join(pkgsPath, name)).isDirectory()) {
            // Get formal app name
            const configData = JSON.parse(
                fs.readFileSync(path.join(pkgsPath, name, 'config.json'))
            );
            // Obj for usage in build gen
            namesObj[configData.schema] = configData.name;
            namesStr += `\n  🔸 ${colors.bold(configData.name)} (${colors.yellow(
        name
      )})`;
        }
    });

    if (list) {
        global.logger.info(
            `\n\n📦 ${colors.green.underline(
        'Packages found for build:'
      )} ${namesStr}`
        );
        return {};
    }

    return namesObj;
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
        getPackagesData(true);
        return;
    }
    // Retrieve info and build only packages specified, or all if not
    packages = getPackagesData(false, argv.packages);

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