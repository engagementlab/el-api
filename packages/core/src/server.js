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

const path = require('path');
const express = require('express');
const colors = require('colors');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');

const ServerUtils = require('../utils/server');
const keystone = require('../keystone');
const buildsRouter = require('../routes');

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
            const cmsRouter = buildsRouter(path.join(__dirname, '../../../bin'));
            config.app.use('/cms', cmsRouter);
        }

        /**
         * Get port from environment and store in Express.
         */
        const port = ServerUtils.normalizePort(process.env.PORT || '3000');

        /**
         * Listen on provided port w/ both keystone instance and API routes
         */
        if(config.routes)
            config.app.use(`/${config.package.schema}`, config.routes);
            
        server = config.app.use([middleware]).listen(port, () => {
            global.logger.info(
                colors.bgCyan.bold.black(
                    `Content API/CMS for "${config.package.name}" started (${
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

const init = (callback, appPackageName) => {
    if (callback) startCallback = callback;

    const productionMode =
        process.argv.slice(2)[0] && process.argv.slice(2)[0] === 'prod';
    // If server defined, close current one
    if (server) server.close();

    const currentApp = !appPackageName ? 'engagement-lab-home' : appPackageName;

    app = express();
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: false,
        })
    );

    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/../views`);

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
    // eslint-disable-next-line global-require,import/no-dynamic-require
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

/**
 * Create an express server, serving either one or all content packages and CMS instance(s)
 * @module
 * @param {function} [callback] - Optional callback
 * @param {string} [appPackageName] - Optional name of content package to mount
 */
module.exports = init;