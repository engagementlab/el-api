/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS static builds router
 * ==========
 */

const fs = require('fs');
const express = require('express');

/**
 * Create a router for all CMS static build outputs
 * @module
 * @param {string} buildsDir - Path to root builds directory (bin)
 */
module.exports = (buildsDir) => {

    /**
     * Get all build directories for CMS builds
     */
    const binPath = buildsDir;

    // Get all builds
    const router = express.Router();
    const allDirs = fs.readdirSync(binPath, {
            withFileTypes: true
        })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    router.use('/@', express.static(binPath));

    // Create route in router for all builds
    allDirs.forEach(name => {
        router.get(`/${name}`, (req, res) => {
            // Send index for this CMS
            res.redirect(`/cms/@/${name}`);
        });

        // We also need a route to render index for all intermediates as per react-dom-router
        router.get(`/@/${name}*`, (req, res) => {
            res.render('cms', {
                schema: name
            });
        });


    });
    return router;
};