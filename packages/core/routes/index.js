/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS static builds router
 * ==========
 */

const ciMode = process.env.NODE_ENV === 'ci';

const fs = require('fs');
const express = require('express');

// Build utils
const utils = require('../build/utils')();

// Middleware
const authentication = require('../utils/auth');
const admin = require('./middleware/admin');

// User model
const User = require('../models/User');

// Passport config
const Passport = require('../utils/passport');

/**
 * Middleware for landing/errors
 * @function
 */
const landing = (req, res) => {
    const appsAllowed = req.session.passport.user.permissions;
    const appsInfo = utils.GetPackagesData(false, appsAllowed.join(','));
    const errPermission = req.query.type === 'permission';
    const errAdmin = req.query.type === 'not-admin';

    res.render('index', {
        apps: appsInfo,
        noAccess: appsInfo.length === 0,
        noPermission: errPermission,
        notAdmin: errAdmin,
    });
};

/**
 * Create a router for all CMS static build outputs and admin pages
 * @module
 * @param {string} buildsDir - Path to root builds directory (bin)
 */
module.exports = buildsDir => {
    // Get all build directories for CMS builds
    const binPath = buildsDir;

    // Get all builds
    const router = express.Router();
    const allDirs = fs
        .readdirSync(binPath, {
            withFileTypes: true,
        })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    // Passport init for router
    Passport(router);

    // Static files
    router.use('/style/:file', (req, res) =>
        res.sendFile(`${binPath}/${req.params.file}.css`)
    );
    router.use('/@', express.static(binPath));

    // Landing page (app selection)
    router.get('/', authentication.isAllowed(), landing);

    // Admin page
    router.get('/admin', authentication.isAllowed(), admin.landing);
    router.post('/admin/edit', admin.userCrud);

    // Errors
    router.get('/error/:type?', authentication.isAllowed(), landing);

    /**
     * Authentication
     */
    router.get('/callback', authentication.callback);

    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    router.get('/login', authentication.login);

    // Create route in router for all builds
    allDirs.forEach(name => {
        router.get(`/${name}`, authentication.isAllowedInApp, (req, res) => {
            // Send index for this CMS
            res.redirect(`/cms/@/${name}`);
        });

        // We also need a route to render index for all intermediates as per react-dom-router
        router.get(`/@/${name}*`, authentication.isAllowedInApp, (req, res) => {
            res.render('cms', {
                schema: name,
            });
        });
    });

    // If on dev or CI instance, create dev user if none
    if (process.env.NODE_ENV === 'development' || ciMode) {
        try {
            User.findOne({
                    email: process.env.DEV_EMAIL,
                },
                (err, user) => {
                    if (err) throw new Error(err);
                    global.logger.info(process.env.DEV_EMAIL);

                    if (!user) {
                        global.logger.info('Create dev user.');
                        User.create({
                            email: process.env.DEV_EMAIL,
                            name: 'Dev User',
                        });
                    }
                }
            );
        } catch (e) {
            throw new Error(e);
        }
    }
    return router;
};