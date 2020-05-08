/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS authentication middleware
 * ==========
 */

// Passport
const passport = require('passport');

// Build utils
const utils = require('../../build/utils')();

/**
 *	Handle CMS auth via passport/google
 */
module.exports = {
    // Perform the login, after login will redirect to callback
    login: passport.authenticate('google', {
        scope: ['openid', 'email', 'profile'],
    }),

    // Handle google oauth2 callback and direct to CMS app requested if success
    callback: (req, res) => {
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

                const appsInfo = utils.GetPackagesData(
                    false,
                    user.permissions.join(',')
                );
                const originalUrl = req.session.redirectTo
                    .replace('/cms/', '')
                    .replace('@/', '');
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
                return null;
            });
        })(req, res);
    },

    // Check if logged in
    isAllowed: (req, res, next) => {

        // Cache URL to bring user to after auth
        req.session.redirectTo = req.originalUrl;

        if (req.isAuthenticated()) next();
        else res.redirect('/cms/login');

    },

    // Check if logged in, and allowed into this app
    isAllowedInApp: (req, res, next) => {

        // Cache URL to bring user to after auth
        req.session.redirectTo = req.originalUrl;

        if (req.isAuthenticated()) {
            const appsAllowed = req.session.passport.user.permissions;
            const appsInfo = utils.GetPackagesData(false, appsAllowed.join(','));
            let originalUrl = req.originalUrl
                .replace('/cms/', '')
                .replace('@/', '');

            // Get /appname from URL requested (only what is before ending / if present)
            if (originalUrl.indexOf('/') > 0)
                originalUrl = originalUrl.substring(0, originalUrl.indexOf('/'));
            const allowed = Object.keys(appsInfo).indexOf(originalUrl) > -1;

            if (!allowed) res.redirect('/cms/error?type=permission');
            else next();

        } else res.redirect('/cms/login');

    },

    // Check if user is admin
    isAdmin: (req, res, next) => {
        if (req.session.passport.user.isAdmin) next();
        else res.redirect('/cms/error?type=not-admin');
    },
};