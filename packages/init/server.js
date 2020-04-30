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
        path: `${__dirname}/.env`
    });
}

const path = require('path');
const fs = require('fs');

const express = require('express');
const colors = require('colors');
const WebSocket = require('ws');

const ServerUtils = require('./utils');
const keystone = require('./keystone');

const appsJson = path.join(__dirname, 'apps.json');

// Create logger 
require('./logger');

let app;
let packages;
let server;
let startCallback;
let socket;
let wss;

const boot = config => {
    // Initialize keystone instance
    keystone(config, middleware => {
        /**
         * Get port from environment and store in Express.
         */
        const port = ServerUtils.normalizePort(process.env.PORT || '3000');

        /**
         * Get all build directories for CMS builds
         */
        const binPath = path.join(__dirname, '../../bin');

        // Get all builds
        const cmsRouter = express.Router();
        const allDirs = fs.readdirSync(binPath, {
                withFileTypes: true
            })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        cmsRouter.use('/@', express.static(binPath));
        // Create route in /cms router for all builds
        allDirs.forEach(name => {
            cmsRouter.get(`/${name}*`, (req, res) => {
                // Send index for this CMS
                res.render('cms', {
                    schema: name
                });
            });

            cmsRouter.get(`/@/${name}*`, (req, res) => {
                res.render('cms', {
                    schema: name
                });
            });


        });
        config.app.use('/cms', cmsRouter);

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

            if (socket) socket.send('loaded');

            // Call class callback if defined (for tests)
            if (startCallback) startCallback(app);
        });
    });
};

const start = async (productionMode, appName) => {
    // If server defined, close current one
    if (server) server.close();

    const currentApp = !appName ? 'home' : appName;

    app = express();
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: false
        })
    );
    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);

    app.get('/', (req, res) => {
        res.render('index', {
            packages
        });
    });

    // Load all data for API of currently used package
    const packagePath = `@engagementlab/${currentApp}`;

    // Pass our route importer util to package
    const packageInit = require(packagePath);
    const pkg = await packageInit(ServerUtils.routeImporter);

    // Export all models, routes, config for this app
    const bootConfig = {
        app,
        package: pkg.Config,
        models: pkg.Models,
        routes: pkg.Routes,
        path: packagePath,
        production: productionMode
    };

    boot(bootConfig);

};

const init = callback => {

    if (callback) startCallback = callback;

    const productionMode =
        process.argv.slice(2)[0] && process.argv.slice(2)[0] === 'prod';

    wss = new WebSocket.Server({
        port: 3001
    });

    wss.on('listening', ws => {
        global.logger.info(`${'Websockets:'.magenta} server listening.`);
    });
    wss.on('connection', ws => {
        ws.on('message', async message => {
            const data = JSON.parse(message);
            global.logger.info(
                `${'Websockets:'.magenta} received ${data.evt}, ${data.id}`
            );

            // Event for server close and reboot w/ new package
            if (data.evt === 'reload') {
                socket = ws;
                start(productionMode, data.id);
            }
        });

        ws.send('Connected.');
    });

    /**
     *  Load all possible apps from sibling packages (config defined in app.json)
     */
    const appConfigs = fs.readFileSync(appsJson);
    packages = JSON.parse(appConfigs);
    global.elasti = undefined;

    start(productionMode);
};

module.exports = init;