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
const packagesList = require('../packages-list');

/**
 * Get config data for all sibling app packages, or for one if name specified.
 * @function
 * @param {boolean} list - Just list app packages
 * @param {string} [pkgNames] - Names of apps for package info to return (comma-seperated)
 */
const GetPackagesData = (list, pkgNames) => {
    let namesStr = '';
    const packages = packagesList;
    let pkgsFiltered = packages;
    const namesObj = {};

    // if (pkgNames) {
    //     pkgsFiltered = packages.filter(pkg => pkgArr.indexOf(pkg.dir) > -1);
    // }
    
    // Object.keys(pkgsFiltered).forEach(key => {
    //     const pkg = pkgsFiltered[key];
    //     namesStr += `\n    🔸 ${colors.bold(pkg.name)} (${colors.yellow(
    //         pkg.dir
    //     )})`;
    // });
        
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
    return packages;
};

/**
 *
 * @module
 */
module.exports = () => ({
    GetPackagesData,
});