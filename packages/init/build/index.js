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
 * @param {string} pkgName - Name of app for package info to load
 */
const getPackagesData = (list, pkgName) => {

    const pkgsPath = path.join(__dirname, '../../../packages');
    fs.readdir(pkgsPath, (err, dirs) => {

        let names = '';
        dirs.filter((name) =>
            name !== 'init').forEach(name => {
            if (fs.statSync(path.join(pkgsPath, name)).isDirectory())
                names += `\n ${name}`;
        });

        if (list)
            global.logger.info(names);

    });
};

/**
 *
 * @module
 * @param {function}
 */
module.exports = (() => {

    /* 
     Handle app arguments
     */
    // List all package names in repo
    if (argv.list) {
        getPackagesData(true);
        return
    }


    // Load all possible apps from sibling packages (config defined in app.json)
    const appConfigs = fs.readFileSync(appsJson);
    const packages = JSON.parse(appConfigs);

    // For all packages...
    packages.forEach(async pkg => {

        try {
            // Call CMS distributable static generator for the current package
            const child = spawn('npm', [
                'run',
                'build',
                '--',
                `--entry=${__dirname}/generator.js`,
                `--out=./../../bin/${pkg}`,
                `--app=${pkg}`,
                `--allApps=${packages}`
            ]);

            child.stdout.on('data', (chunk) => {
                global.logger.info(chunk);
            });

            child.stdout.on('err', (chunk) => {
                global.logger.error(chunk);
            });

            child.stdout.on('close', () => {
                global.logger.info(`🍺 CMS bundle exported for ${colors.yellow(pkg)}.`);

            });

        } catch (err) {
            global.logger.error(err);
        }
    });

})();