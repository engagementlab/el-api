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
 * Module dependencies.
 */
// Load .env vars if not in CI environment
if (process.env.NODE_ENV !== 'ci') {
    // eslint-disable-next-line global-require
    require('dotenv').config({
        path: `${__dirname}/.env`,
    });
}

const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const colors = require('colors');

const ServerUtils = require('./utils');
const keystone = require('./keystone');
const buildsRouter = require('./routes');

const elShortener = require('../shortener');

// Create logger
require('./logger');

let app;
let server;
let startCallback;

const boot = config => {
    // Initialize keystone instance
    keystone(config, middleware => {
        // This does nothing for now except return 200 to confirm boot for unit tests
        config.app.get('/', (req, res) => res.status(200).send('Ready'));

        /**
         * Create router for all CMS builds from outputs dir if not on dev
         */
        if (process.env.NODE_ENV !== 'development') {
            const cmsRouter = buildsRouter(path.join(__dirname, '../../bin'));
            config.app.use('/cms', cmsRouter);
        }

        /**
         * Use middleware for GraphQL instance of URL shortener service 
         */
        // config.app.use('/shortener', elShortener());

        /**
         * Get port from environment and store in Express.
         */
        const port = ServerUtils.normalizePort(process.env.PORT || '3000');

        /**
         * Listen on provided port w/ both keystone instance and API routes
         */
        server = config.app.use([middleware, config.routes]).listen(port, () => {
            global.logger.info(
                colors.bgCyan.bold.black(
                    `Content API for "${config.package.name}" started (${
                        config.production ? 'Production' : 'Development'
                    } Mode).`
                )
            );

            // Error
            config.app.get('*', (req, res) => {
                res.status(500).send(`No route found for path ${req.url}.`);
            });

            // Call class callback if defined (for tests)
            if (startCallback) startCallback(app);
        });
    });
};

const start = (productionMode, appName) => {
    // If server defined, close current one
    if (server) server.close();

    const currentApp = !appName ? 'home' : appName;

    app = express();
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: false,
        })
    );

    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);

    let dbPrefix = 'mongodb://localhost/';
    const env = process.env.NODE_ENV;
    if (env !== 'development') {
        if (env === 'staging' || env === 'ci')
            dbPrefix = process.env.MONGO_CLOUD_STAGING_URI;
        else
            dbPrefix = process.env.MONGO_CLOUD_URI;
    }
    // Allow all origins on dev
    else
        app.use(cors());

    // Load all data for API of currently used package
    const packagePath = `@engagementlab/${currentApp}`;

    // Pass our route importer util, DB string prefix to package
    const packageInit = require(packagePath);
    packageInit({
        importer: ServerUtils.routeImporter,
        dbPrefix,
    }).then(pkg => {
        // Export all models, routes, config for this app
        const bootConfig = {
            app,
            dbPrefix,
            package: pkg.Config,
            models: pkg.Models,
            routes: pkg.Routes,
            path: packagePath,
            production: productionMode,
        };

        boot(bootConfig);
    });
};

const init = callback => {
    if (callback) startCallback = callback;

    const productionMode =
        process.argv.slice(2)[0] && process.argv.slice(2)[0] === 'prod';

    /**
     *    Create DB connection for admin database, which contains CMS privileges, etc.
     */
    const dbAddress =
        process.env.NODE_ENV !== 'production' ?
        process.env.MONGO_ADMIN_URI :
        process.env.MONGO_CLOUD_ADMIN_URI;
    if (!dbAddress)
        global.logger.error(
            `Please provide ${
                process.env.NODE_ENV === 'production' ? 'MONGO' : 'MONGO_CLOUD'
            }_ADMIN_URI.`
        );
    try {
        if (process.env.NODE_ENV !== 'production')
            global.logger.info(`Connecting to admin DB at ${process.env.MONGO_ADMIN_URI}`);

        mongoose.connect(dbAddress, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    } catch (e) {
        global.logger.error(e);
        throw new Error(e);
    }
    
    start(productionMode);
};

module.exports = init;