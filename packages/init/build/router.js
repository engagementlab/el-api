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
const utils = require('./utils')();

// User model
const User = require('../models/User');

/**
 *	Handle CMS auth via passport/google
 */
const authentication = {
    // Perform the login, after login will redirect to callback
    login: passport.authenticate('google', {
        scope: ['openid', 'email', 'profile'],
    }),

    isAllowed: (req, res, next) => {
        // Cache URL to bring user to after auth
        req.session.redirectTo = req.originalUrl;

        // Check if logged in
        if (req.isAuthenticated()) next();
        else res.redirect('/cms/login');

    },
    isAllowedInApp: (req, res, next) => {
        // Check if logged in, and allowed into this app
        if (req.isAuthenticated()) {
            const appsAllowed = req.session.passport.user.permissions;
            const appsInfo = utils.GetPackagesData(false, appsAllowed.join(','));
            const originalUrl = req.originalUrl.replace('/cms/', '').replace('@/', '');
            // Get /appname from URL requested
            const appUrl = originalUrl.substring(0, originalUrl.indexOf('/'));
            const allowed = Object.keys(appsInfo).indexOf(appUrl) > -1;

            if (!allowed)
                res.redirect('/cms/error?type=permission');
            else
                next();

        } else res.redirect('/cms/login');

    },
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
     * Middleware for landing/errors
     */
    const landing = (req, res) => {
        const appsAllowed = req.session.passport.user.permissions;
        const appsInfo = utils.GetPackagesData(false, appsAllowed.join(','));
        const errPermission = req.query.type === 'permission';

        res.render('index', {
            apps: appsInfo,
            noAccess: appsInfo.length === 0,
            noPermission: errPermission,
        });
    };

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
    router.use('/style', (req, res) => res.sendFile(`${binPath}/global.css`));
    router.use('/@', express.static(binPath));

    // Landing page (app selection)
    router.get('/', authentication.isAllowed, landing);

    // Errors
    router.get('/error/:type?', authentication.isAllowed, landing);

    /**
     * Authentication
     */
    // Handle google oauth2 callback and direct to CMS app requested if success
    router.get('/callback', (req, res, next) => {
        passport.authenticate('google', (error, user, info) => {
            if (error) {
                res.status(401).send(error);
                return;
            }
            if (!user) {
                res.status(401).send(info);
                return;
            }

            // Log user in
            req.logIn(user, logInErr => {
                if (logInErr) {
                    res.status(500).send(logInErr);
                    return logInErr;
                }

                const appsInfo = utils.GetPackagesData(false, user.permissions.join(','));
                const originalUrl = req.session.redirectTo.replace('/cms/', '').replace('@/', '');
                // Get /appname from URL requested
                const appUrl = originalUrl.substring(0, originalUrl.indexOf('/'));
                const allowed = Object.keys(appsInfo).indexOf(appUrl) > -1;

                // Explicitly save the session before redirecting!
                req.session.save(() => {
                    // Ensure user has permissions for this CMS
                    if (req.session.redirectTo === 'cms/' || allowed) {
                        res.redirect(req.session.redirectTo || '/');
                    } else res.redirect('/cms/error?type=permission');
                });
            });
        })(req, res);
    });

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