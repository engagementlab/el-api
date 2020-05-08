/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS static builds router
 * ==========
 */

const fs = require('fs');
const express = require('express');
const session = require('express-session');

// Passport
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Build utils
const utils = require('../build/utils')();

// Middleware
const authentication = require('./middleware/auth');

// User model
const User = require('../models/User');

/**
 * Middleware for landing/errors
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
 * Middleware for admin page
 */
const adminPage = (req, res) => {
    // Get all apps
    const appsInfo = utils.GetPackagesData(false);
    User.find({}, (err, users) => {
        res.render('admin', {
            apps: appsInfo,
            users,
        });
    });
};

/**
 * Middleware for admin user modification
 */
const adminUserEdit = (req, res) => {

    try {
        const {
            body,
        } = req;
        if (body.email && body.name) {
            User.create({
                name: body.name,
                email: body.email,
                isAdmin: body.isAdmin,
                permissions: body.permissions,
            }, (err, user) => {
                if (err) {
                    // Catch dupe email
                    if (err.name === 'MongoError' && err.keyPattern.email === 1)
                        res.status(500).send({
                            msg: 'email',
                        });
                    else
                        res.status(500).send(err);
                } else {
                    res.status(200).send({
                        msg: 'created',
                    });
                }
            });
        } else {

            User.findOne({
                _id: body.userId,
            }, async (err, user) => {
                if (err) res.status(500).send(err);
                else if (body.delete) {
                    if (!user) {
                        res.status(500).send();
                        return;
                    }
                    user.delete();
                    res.status(200).send({
                        msg: 'deleted',
                    });
                } else {
                    // eslint-disable-next-line no-param-reassign
                    if (body.permissions) user.permissions = body.permissions;
                    // eslint-disable-next-line no-param-reassign
                    if (body.isAdmin !== undefined) user.isAdmin = body.isAdmin;
                    user.save();
                    res.status(200).send({
                        msg: 'saved',
                    });
                }
            });
        }
    } catch (saveErr) {
        global.logger.error(saveErr);
        res.status(500).send(saveErr.toString());
    }

};

/**
 * Create a router for all CMS static build outputs
 * @module
 * @param {string} buildsDir - Path to root builds directory (bin)
 */
module.exports = buildsDir => {
    /**
     * Get all build directories for CMS builds
     */
    const binPath = buildsDir;

    // Get all builds
    const router = express.Router();
    const allDirs = fs
        .readdirSync(binPath, {
            withFileTypes: true,
        })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    /**
     * Google oauth2/passport config
     */

    // Session store
    //  TODO: mongostore for prod
    router.use(
        session({
            secret: process.env.SESSION_COOKIE,
            resave: true,
            saveUninitialized: false,
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    const strategy = new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.AUTH_CALLBACK_URL,
            passReqToCallback: true,
        },
        (request, accessToken, refreshToken, profile, done) => {
            // Verify user allowed
            User.findOne({
                    email: profile.emails[0].value,
                },
                (err, user) => {
                    if (err) {
                        global.logger.error(`Login error: ${err}`);
                        return done(err);
                    }
                    if (!user) {
                        global.logger.error(
                            `Login error: user not found for email ${profile.emails[0].value}`
                        );
                        return done(err);
                    }
                    return done(err, user);
                }
            );
        }
    );
    passport.use(strategy);

    const bodyParser = require('body-parser');
    // Support json encoded bodies
    router.use(bodyParser.json());
    // Support encoded bodies
    router.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    router.use(passport.initialize());
    router.use(passport.session());

    // Static files
    router.use('/style/:file', (req, res) =>
        res.sendFile(`${binPath}/${req.params.file}.css`)
    );
    router.use('/@', express.static(binPath));

    // Landing page (app selection)
    router.get('/', authentication.isAllowed, landing);

    // Admin page
    router.get('/admin', adminPage);
    router.post('/admin/edit', adminUserEdit);

    // Errors
    router.get('/error/:type?', authentication.isAllowed, landing);

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

    // If on dev instance, create dev user if none
    if (process.env.NODE_ENV === 'development') {
        User.findOne({
                email: process.env.DEV_EMAIL,
            },
            (err, user) => {
                if (!user) {
                    User.create({
                        email: process.env.DEV_EMAIL,
                        name: 'Dev User',
                    });
                }
            }
        );
    }
    return router;
};