#!/usr/bin/env node;

/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 * ==============
 * App start
 *
 * @author Johnny Richardson
 * @author Ralph Drake
 *
 * ==========
 */
const colors = require('colors');

// Base API server
const server = require('./server');

// Create logger
require('./logger');

/*
 * If "server" mode is enabled, run core express server,
 * which serves all data APIs and CMS instances.
 * Otherwise, just expose core utilities.
 */
if (process.env.SERVER_MODE === true || process.argv.indexOf('--server') > -1)
    server();
else {
    /**
     * @typedef {Object} Utils
     * @property {Object} Auth - Authentication middleware
     * @property {function} Passport - Passport configuration middleware
     */
    /**
     * Engagement Lab Content and Data API Core Utilities
     * @type Utils - Core Utilities
     */
    module.exports = {
        // eslint-disable-next-line global-require
        Auth: require('./utils/auth'),
        // eslint-disable-next-line global-require
        Passport: require('./utils/passport'),
    };
    global.logger.info(
        `${colors.bgGreen.bold.blue('Core')}: Utils ready for use. (${
            process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
        } Mode).`
    );
}