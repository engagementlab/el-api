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

// Passport
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// User model
const User = require('../models/User');

/**
 *	Handle CMS auth via passport/google
 */
const authentication = {
    // Perform the login, after login will redirect to callback
    login: passport.authenticate('google', {
        scope: ['openid', 'email', 'profile']
    }),

    // Handle google oauth2 callback and direct to CMS app requested if success
    callback: (req, res, next) => {
        // if(process.env.NODE_ENV === 'development') {
        // 	res.redirect('/cms');
        // 	return;
        // } 

        passport.authenticate('google', (err, user, info) => {
            console.log(req);
            if (err) {
                global.logger.error('Auth error!', err);
                return next(err);
            }
            if (!user) {
                global.logger.error('No user!', info);
                return res.redirect('/');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/cms/home');
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
     * Google oauth2/passport config
     */

    router.use(passport.initialize());
    router.use(passport.session());

    const strategy = new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.AUTH_CALLBACK_URL,
            passReqToCallback: true,
        },
        (request, accessToken, refreshToken, profile, done) => {
            // Verify user allowed
            User.findOne({
                email: profile.emails[0].value
            }, (err, user) => {
                if (err) {
                    global.logger.error(`Login error: ${err}`);
                    return null;
                }
                if (!user) {
                    global.logger.error(`Login error: user not found for email ${ profile.emails[0].value}`);
                    return null;
                }
                return done(err, user);
            });
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
    router.get('/callback', authentication.callback);
    router.get('/*', authentication.login, (req, res, next) => {
        next();
    });

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

    // If on dev instance, create dev user if none
    // TODO: Limit to dev
    User.findOne({
        email: process.env.DEV_EMAIL
    }, (err, user) => {
        if (!user) {
            User.create({
                email: process.env.DEV_EMAIL,
                name: 'Dev User'
            });
        }
    });
    return router;
};