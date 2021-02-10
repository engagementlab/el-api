/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS static build launcher
 * ==========
 */

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const {
    spawn,
} = require('child_process');
const {
    argv,
} = require('yargs');

const colors = require('colors');
const glob = require('glob');

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
            const jsPath = path.join(binPath, 'admin/secure/js');
            const bundleFile = glob.sync('main*.js', {
                cwd: jsPath,
            })[0];

            try {
                // Delete index; it is served by views/cms template
                fs.unlinkSync(path.join(binPath, 'admin/secure/index.html'));
                //    Move 'main' webpack bundle as [root]/bundle.js
                fs.renameSync(
                    path.join(jsPath, bundleFile),
                    path.join(binPath, 'bundle.js')
                );
                // Get all remaining packed bundles
                const listFiles = glob.sync('*bundle.js', {
                    cwd: jsPath,
                });
                // Move all other bundles under [root]/js
                fs.mkdirSync(path.join(binPath, 'js'));
                listFiles.forEach(file => {
                    fs.renameSync(
                        path.join(jsPath, file),
                        path.join(binPath, `js/${file}`)
                    );
                });
                // Delete dangling dir (via fs-extra)
                fse.removeSync(path.join(binPath, 'admin'));
            } catch (e) {
                global.logger.error(e);
                throw new Error(e);
            }
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
                'build-cms',
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
                if (err !== 0) {
                    global.logger.error(
                        `⛔ Uncaught error for ${colors.yellow(pkg.name)} process (code: ${err}) ${info}.`
                    );
                } else {
                    global.logger.info(
                        `🍺 CMS bundle exported for ${colors.yellow(pkg.name)}.`
                    );
                    exportsDone.push(outDir);

                    if (exportsDone.length === keys.length) {
                        global.logger.info(
                            '✨    All bundles done, organizing directories.    ✨'
                        );
                        postBuild(exportsDone);
                    }
                }
            });
            child.stderr.on('data', errout => 
                global.logger.error(
                    `>> Output for ${colors.yellow(pkg.name)}: ${errout.toString()}.`
                ));
        } catch (err) {
            global.logger.error(err);
        }
    });
})();