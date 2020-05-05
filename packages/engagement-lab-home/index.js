/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */

const { MongoClient } = require('mongodb');

const fs = require('fs');
const routes = require('./routes');
const models = require('./models')();

/**
 * Module API instantiation or CMS static build config.
 * @module
 * @param {function} routesImporter - The instance of initialization module's routes importer.
 * @param {boolean} configOnly - Skip API routes instantiation and return only data models and package config.
 * @returns {object} Package's routes, models, config.
 */
module.exports = (routesImporter, configOnly) => {
      const dataFile = fs.readFileSync(`${__dirname}/config.json`);
      const configData = JSON.parse(dataFile);
      const packageConfig = {
            Routes: null,
            Models: models,
            Config: configData,
      };

      // Just return config data and data models
      if (configOnly) {
            global.logger.simple.info('🏛️  Homepage config loaded.');
            return packageConfig;
      }

      return new Promise(resolve => {
            // Create DB connection and import API routes if not generating CMS build
            const dbAddress =
                  process.env.NODE_ENV === 'development'
                        ? 'mongodb://localhost'
                        : `${process.env.MONGO_CLOUD_URI}${configData.database}?retryWrites=true&w=majority`;

            MongoClient.connect(dbAddress, {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
            }).then(client => {
                  const db = client.db(configData.database);
                  const appRoutes = routes(routesImporter, db);
                  // TODO: give all routes a namespace prefix, e.g. 'homepage/'
                  packageConfig.Routes = appRoutes;
                  resolve(packageConfig);
                  global.logger.info('🚀 Homepage API ready.');
            });
      });
};
