/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */

const fs = require('fs');
const routes = require('./routes');
const models = require('./models')();
const mongoose = require('mongoose');

/**
 * Module API instantiation or CMS static build config.
 * @module
 * @param {function} config.importer - The instance of initialization module's routes importer.
 * @param {string} config.dbPrefix - The instance of initialization module's routes importer.
 * @param {boolean} config.skipRoutes - Skip API routes instantiation and return only data models and package config.
 * @returns {object} Package's routes, models, config.
 */
module.exports = config => {
    const dataFile = fs.readFileSync(`${__dirname}/config.json`);
    const pkgData = JSON.parse(dataFile);
    const packageConfig = {
        Routes: null,
        Models: models,
        Config: pkgData,
    };

    // Just return config data and data models
    if (config.skipRoutes) {
        global.logger.simple.info('🏛️    Homepage config loaded.');
        return packageConfig;
    }

    return new Promise(resolve => {
        // Create DB connection and import API routes if not generating CMS build
        const dbAddress = `${config.dbPrefix}${pkgData.database}?retryWrites=true&w=majority`;

        mongoose.createConnection(dbAddress, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        models.forEach(m => {
            mongoose.model(m.name, new mongoose.Schema(m.schema));
        });
        const appRoutes = routes(config.importer, mongoose);
        packageConfig.Routes = appRoutes;
        resolve(packageConfig);
        global.logger.info('🚀 Homepage API ready');


    });
};