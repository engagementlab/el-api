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

// Passport
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

/**
		Handle CMS auth via Auth0 and passport
	*/
const authentication = {
    // Perform the login, after login Auth0 will redirect to callback
    login: require('passport').authenticate('auth0', {
        scope: 'openid email profile'
    }),

    // Handle Auth0 callback and direct to CMS backend if success
    callback: (req, res, next) => {
        // if(process.env.NODE_ENV === 'development') {
        // 	res.redirect('/cms');
        // 	return;
        // }

        require('passport').authenticate('auth0', function (err, user, info) {
            if (err) {
                global.logger.error('Auth error!', err);
                return next(err);
            }
            if (!user) {
                global.logger.error('No user!', info);
                return res.redirect('/');
            }

            req.logIn(user, err => {
                if (err) {
                    console.error('Login error', err);
                    return next(err);
                }
                const {
                    returnTo
                } = req.session;
                delete req.session.returnTo;

                res.redirect(returnTo || '/cms');
            });
        })(req, res, next);
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
            withFileTypes: true
        })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    /**
     * Auth0/passport config
     */

    router.use(passport.initialize());
    router.use(passport.session());

    // Configure Passport to use Auth0
    const strategy = new Auth0Strategy({
            domain: process.env.AUTH0_DOMAIN,
            clientID: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
        },
        (accessToken, refreshToken, extraParams, profile, done) => {
            return done(null, profile);
        }
    );

    passport.use(strategy);
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // Static files
    router.use('/@', express.static(binPath));

    // Authentication
    router.get('/*', authentication.login);
    router.get('/callback', authentication.callback);

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