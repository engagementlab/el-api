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
const colors = require('colors');

/**
 * Get config data for all sibling app packages, or for one if name specified.
 * @function
 * @param {boolean} list - Just list app packages
 * @param {string} [pkgNames] - Names of apps for package info to return (comma-seperated)
 */
const GetPackagesData = (list, pkgNames) => {
    const pkgsPath = path.join(__dirname, '../../../packages');
    const dirs = fs.readdirSync(pkgsPath);
    let namesStr = '';
    const namesObj = {};

    // Do not include 'core' package, and only package(s) specified if any
    let dirsFiltered = dirs.filter(name => name !== 'core');
    if (pkgNames) {
        const pkgArr = pkgNames.split(',');
        dirsFiltered = dirsFiltered.filter(name => pkgArr.indexOf(name) > -1);
    }

    dirsFiltered.forEach(name => {
        if (fs.statSync(path.join(pkgsPath, name)).isDirectory()) {
            // Skip if no config.json
            if (!fs.existsSync(path.join(pkgsPath, name, 'config.json'))) return;
            // Get formal app name
            const configData = JSON.parse(
                fs.readFileSync(path.join(pkgsPath, name, 'config.json'))
            );

            // Obj for usage in build gen and API mount
            namesObj[configData.schema] = {
                name: configData.name,
                dir: name,
            };
            namesStr += `\n    🔸 ${colors.bold(configData.name)} (${colors.yellow(
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
    global.logger.info(
        `\n\n🌮 ${colors.green.underline(
            'Package(s) loaded:'
        )} ${namesStr}`
    );
    return namesObj;
};

/**
 *
 * @module
 */
module.exports = () => ({
    GetPackagesData,
});