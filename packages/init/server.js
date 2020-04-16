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

const appsJson = path.join(__dirname, 'apps.json');

const fs = require('fs');
const express = require('express');
const winston = require('winston');
const colors = require('colors');
const elasticsearch = require('elasticsearch');
const WebSocket = require('ws');

const ServerUtils = require('./utils');
const keystone = require('./keystone');

let app;
let packages;
let server;
let startCallback;
let socket;
let wss;

const boot = (config) => {

    // Initialize keystone instance
    keystone(config, (middleware) => {
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

            if (socket) socket.send('loaded');

            // Call class callback if defined (for tests)
            if (startCallback) startCallback(app);
        });
    });
};

const searchBoot = (searchApp) => {
    global.elasti = new elasticsearch.Client({
        node: process.env.ELASTISEARCH_NODE_URL,
    });
    global.elasti.ping((error) => {
        if (error) {
            global.logger.error('Elasticsearch ERROR!', error);
        } else {
            global.logger.info(
                colors.bgGray.yellow(
                    `Search cluster running at ${process.env.ELASTISEARCH_NODE_URL}`
                )
            );
            boot(searchApp);
        }
    });
};

const start = (productionMode, appName) => {
    // If server defined, close current one
    if (server) server.close();

    const currentApp = (!appName) ? 'homepage' : appName;

    app = express();
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: false,
        })
    );
    app.set('view engine', 'pug');
    app.set('views', `${__dirname}/views`);

    app.get('/', (req, res) => {
        res.render('index', {
            packages,
        });
    });

    // Load all data for API of currently used package
    const packagePath = `@engagementlab/${currentApp}`;

    // Pass our route importer util to package
    const packageModule = require(packagePath)(ServerUtils.routeImporter);

    // Get config and routes
    const packageConfig = packageModule.Config;
    const packageApiRoutes = packageModule.Routes;

    // Export all models for current app
    const packageModels = packageModule.Models();

    const bootConfig = {
        app,
        package: packageConfig,
        path: packagePath,
        models: packageModels,
        routes: packageApiRoutes,
        production: productionMode,
    };
    if (process.env.SEARCH_ENABLED === 'true') searchBoot(app);
    else boot(bootConfig);
};

const init = (callback) => {

    if (callback) startCallback = callback;

    const productionMode = process.argv.slice(2)[0] && process.argv.slice(2)[0] === 'prod';

    wss = new WebSocket.Server({
        port: 3001,
    });

    wss.on('listening', (ws) => {
        global.logger.info(`${'Websockets:'.magenta} server listening.`);
    });
    wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
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

    const logFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info) => {
            const {
                timestamp,
                level,
                message,
                ...args
            } = info;

            const ts = timestamp.slice(0, 19).replace('T', ' ');
            return (
                `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
            );
        })
    );

    global.logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [new winston.transports.Console()],
    });
    global.elasti = undefined;

    start(productionMode);
};

module.exports = init;