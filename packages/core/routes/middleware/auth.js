/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * CMS authentication middleware
 * ==========
 */
const ciMode = process.env.NODE_ENV === 'ci';

// Passport
const passport = require('passport');

// Build utils
const utils = require('../../build/utils')();

/**
 * Find if url being accessed for CMS is in user's permissions.
 * @function
 * @param {Array} permissions - List of permissions from user records
 * @param {string} url - Full URL being accessed
 * @returns {boolean} - Is user allowed?
 *
 */
const UrlAllowed = (permissions, url) => {
  const appsInfo = utils.GetPackagesData(false, permissions.join(','));
  let originalUrl = url.replace('/cms/', '').replace('@/', '');

  // Get /appname from URL requested (only what is before ending / if present)
  if (originalUrl.indexOf('/') > 0)
    originalUrl = originalUrl.substring(0, originalUrl.indexOf('/'));

  // Url is in list of allowed apps?
  return Object.keys(appsInfo).indexOf(originalUrl) > -1;
};

/**
 *	Handle CMS auth via passport/google
 */
module.exports = {
  /**
   * Perform the login, after login will redirect to callback
   * @function
   */
  login: passport.authenticate(ciMode ? 'mocked' : 'google', {
    scope: ['openid', 'email', 'profile'],
  }),

  /**
   * Handle google oauth2 callback and direct to CMS app requested if success
   * @function
   */
  callback: (req, res) => {

    passport.authenticate(ciMode ? 'mocked' : 'google', (error, user, info) => {
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

        // Explicitly save the session before redirecting!
        req.session.save(() => {
          // Ensure user has permissions for this CMS
          const allowed = ciMode || !UrlAllowed(user.permissions, req.session.redirectTo);
          if (req.session.redirectTo === 'cms/' || allowed) {
            res.redirect(req.session.redirectTo || '/');
          } else res.redirect('/cms/error?type=permission');
        });
        return null;
      });
    })(req, res);
  },

  /**
   *  Check if user is logged in
   * @function
   */
  isAllowed: (req, res, next) => {
    // Cache URL to bring user to after auth
    req.session.redirectTo = req.originalUrl;

    if (req.isAuthenticated()) next();
    else res.redirect('/cms/login');
  },

  /**
   * Check if logged in, and allowed into this app
   * @function
   */
  isAllowedInApp: (req, res, next) => {
    // Cache URL to bring user to after auth
    req.session.redirectTo = req.originalUrl;

    // In ci env, user is fake
    if (ciMode || req.isAuthenticated()) {
      const appsAllowed = ciMode ? [] : req.session.passport.user.permissions;
      // If not allowed, send error page
      if (!ciMode && !UrlAllowed(appsAllowed, req.originalUrl))
        res.redirect('/cms/error?type=permission');
      else next();
    } else res.redirect('/cms/login');
  },

  // Check if user is admin
  isAdmin: (req, res, next) => {
    if (req.session.passport.user.isAdmin) next();
    else res.redirect('/cms/error?type=not-admin');
  },
};