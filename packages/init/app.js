#!/usr/bin/env node;

/**
 * Engagement Lab Website v2.x content service
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
// Load .env vars
require('dotenv').config({
  path: `${__dirname}/.env`
});

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

let productionMode;
let app;
let wss;
let socket;
let server;

const start = (productionMode, currentApp) => {
  // If server defined, close current one
  if (server) server.close();

  if (!currentApp) currentApp = 'homepage';

  // Load all routes for API of currently used package
  const packagePath = `@engagement-lab/${currentApp}`;
  const packageModule = require(packagePath);
  const packageConfig = packageModule.Config();
  const routes = packageModule.Routes;
  const packageApiRoutes = routes(app);

  const bootConfig = {
    app,
    package: packageConfig,
    path: packagePath,
    routes: packageApiRoutes,
    production: productionMode
  };
  if (process.env.SEARCH_ENABLED === 'true') searchBoot(app);
  else boot(bootConfig);
};

const boot = config => {
  // Export all models for current app
  const models = require(config.path).Models();
  const ksConfig = {
    models,
    package: config.package
  };

  // Initialize keystone instance
  keystone(ksConfig, (middleware, keystoneInstance) => {
    /**
     * Get port from environment and store in Express.
     */
    const port = ServerUtils.normalizePort(process.env.PORT || '3000');

    config.app.use((req, res, next) => {
      res.locals.db = keystoneInstance;
      next();
    });

    /**
     * Listen on provided port w/ both keystone instance and API
     */
    server = config.app.use([middleware, config.routes]).listen(port);

    global.logger.info(
      colors.bgCyan.bold.black(
        `Content API for "${config.package.name}" started (${
          config.production ? 'Production' : 'Development'
        } Mode).`
      )
    );

    if (socket) socket.send('loaded');
  });
};

const searchBoot = app => {
  global.elasti = new elasticsearch.Client({
    node: process.env.ELASTISEARCH_NODE_URL
  });
  global.elasti.ping(error => {
    if (error) {
      global.logger.error('Elasticsearch ERROR!', error);
    } else {
      global.logger.info(
        colors.bgGray.yellow(
          `Search cluster running at ${process.env.ELASTISEARCH_NODE_URL}`
        )
      );
      boot(app);
    }
  });
};

const init = () => {
  productionMode =
    process.argv.slice(2)[0] && process.argv.slice(2)[0] === 'prod';

  wss = new WebSocket.Server({
    port: 3001
  });

  wss.on('listening', ws => {
    global.logger.info(`${'Websockets:'.magenta} server listening.`);
  });
  wss.on('connection', ws => {
    ws.on('message', message => {
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
  const { apps } = JSON.parse(appConfigs);
  app = express();

  const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => {
      const { timestamp, level, message, ...args } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`;
    })
  );

  global.logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [new winston.transports.Console()]
  });
  global.elasti = undefined;

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
      apps
    });
  });

  start(productionMode);
};

module.exports = init();
