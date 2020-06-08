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

const colors = require('colors');
const mongoose = require('mongoose');

// Create logger
require('./logger');

/**
 * Create instance of package.
 * @param {string} path - Path to root of current app (used to load .env)
 * @return {Utils|null} 
 */
const Core = path => {

    // Load .env vars if not in CI environment
    if (process.env.NODE_ENV !== 'ci') {
        // eslint-disable-next-line global-require
        require('dotenv').config({
            path: `${path || __dirname}/.env`,
        });
    }

    /**
     * Create DB connection for admin database, which contains CMS privileges, etc.
     * 
     */
    const dbAddress =
        process.env.NODE_ENV !== 'production' ?
        process.env.MONGO_ADMIN_URI :
        process.env.MONGO_CLOUD_ADMIN_URI;
    if (!dbAddress) {
        const err =
            `Please provide ${
                process.env.NODE_ENV !== 'production' ? 'MONGO' : 'MONGO_CLOUD'
            }_ADMIN_URI.`;
        global.logger.error(err);
        throw new Error(err);
    }

    try {
        if (process.env.NODE_ENV !== 'production')
            global.logger.info(`Connecting to admin DB at ${dbAddress}`);

        mongoose.connect(dbAddress, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    } catch (e) {
        global.logger.error(e);
        throw new Error(e);
    }

    if (process.env.SERVER_MODE === true || process.argv.indexOf('--server') === -1) {

        global.logger.info(
            `${colors.bgGreen.bold.blue('Core')}: Utils ready for use. (${
                process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
            } Mode).`
        );

        /**
         * Engagement Lab Content and Data API Core Utilities
         * @type Utils
         */
        return {
            // eslint-disable-next-line global-require
            Auth: require('./utils/auth'),
            // eslint-disable-next-line global-require
            Passport: require('./utils/passport'),
            // eslint-disable-next-line global-require
            Server: require('./utils/server'),
        };
    }
    return null;
};

/*
 * If "server" mode is enabled, run core express server,
 * which serves all data APIs and CMS instances.
 * Otherwise, just expose core utilities.
 */
if (process.env.SERVER_MODE === true || process.argv.indexOf('--server') > -1) {
    // Base API server
    // eslint-disable-next-line global-require
    Core();
    require('./server')();
} else
    module.exports = Core;