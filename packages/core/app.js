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

/**
 * @typedef {Object} Utils
 * @property {Object} Auth - Authentication middleware
 * @property {function} Passport - Passport configuration middleware
 * @property {Object} Server - Various utilities for express server instances
 */

// Load .env vars if not in CI environment
if (process.env.NODE_ENV !== 'ci') {
    // eslint-disable-next-line global-require
    require('dotenv').config({
        path: `${__dirname}/.env`,
    });
}

const colors = require('colors');

// Create logger
require('./logger');

/*
 * If "server" mode is enabled, run core express server,
 * which serves all data APIs and CMS instances.
 * Otherwise, just expose core utilities.
 */
if (process.env.SERVER_MODE === true || process.argv.indexOf('--server') > -1) {
    // Base API server
    // eslint-disable-next-line global-require
    require('./server')();
} else {

    /**
     * Engagement Lab Content and Data API Core Utilities
     * @type Utils - Core Utilities
     */
    module.exports = {
        // eslint-disable-next-line global-require
        Auth: require('./utils/auth'),
        // eslint-disable-next-line global-require
        Passport: require('./utils/passport'),
        // eslint-disable-next-line global-require
        Server: require('./utils/server'),
    };
    global.logger.info(
        `${colors.bgGreen.bold.blue('Core')}: Utils ready for use. (${
            process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
        } Mode).`
    );
}