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
const fs = require('fs');
const express = require('express');
const winston = require('winston');
const colors = require('colors');
const elasticsearch = require('elasticsearch');
const ServerUtils = require('./utils');

const appsJson = path.join(__dirname, 'apps.json');

const keystone = require('./keystone');

const start = (currentApp) => {

  /**
   *  Load all possible apps from sibling packages (config defined in app.json)
   */
  const appConfigs = fs.readFileSync(appsJson);
  const {
    apps,
  } = JSON.parse(appConfigs);

  if (!currentApp) currentApp = 'homepage';

  /**
   * Get port from environment and store in Express.
   */
  const productionMode = process.argv.slice(2)[0] && process.argv.slice(2)[0] === 'prod';
  const app = express();

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
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
    }),
  );

  global.logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
      new winston.transports.Console(),
    ],
  });
  global.elasti = undefined;

  app.use(express.json());
  app.use(express.urlencoded({
    extended: false,
  }));
  app.set('view engine', 'pug');

  app.get('/', (req, res) => {
    res.render('index', {
      apps,
    });
  });

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
    production: productionMode,
  };
  if (process.env.SEARCH_ENABLED === 'true') searchBoot(app);
  else boot(bootConfig);
};

const boot = (config) => {
  // Export all models for current app
  const models = require(config.path).Models();
  const ksConfig = {
    models,
    package: config.package
  }

  // Initialize keystone instance
  keystone(ksConfig, (middleware, keystoneInstance) => {
    const port = ServerUtils.normalizePort(process.env.PORT || '3000');

    config.app.get('/api/reload', (req, res) => {

    });
    config.app.use((req, res, next) => {
      res.locals.db = keystoneInstance;
      next();
    });

    /**
     * Listen on provided port w/ both keystone instance and API
     */
    config.app.use([middleware, config.routes]).listen(port);

    global.logger.info(colors.bgCyan.bold.black(`Content API for "${config.package.name}" started (${config.production ? 'Production' : 'Development'} Mode).`));
  });
};

const searchBoot = (app) => {
  global.elasti = new elasticsearch.Client({
    node: process.env.ELASTISEARCH_NODE_URL,
  });
  global.elasti.ping((error) => {
    if (error) {
      global.logger.error('Elasticsearch ERROR!', error);
    } else {
      global.logger.info(colors.bgGray.yellow(`Search cluster running at ${process.env.ELASTISEARCH_NODE_URL}`));
      boot(app);
    }
  });
};

module.exports = start();