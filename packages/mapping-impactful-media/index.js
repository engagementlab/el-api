/**
 * Mapping Impactful Media package
 * Developed by Engagement Lab, 2021
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */
const fs = require('fs');
const models = require('./models')();

/**
 * Module API instantiation or CMS static build config.
 * @module
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
        global.logger.simple.info('🏛️    Mapping Impactful Media config loaded.');
        return packageConfig;
    }

    return new Promise(resolve => {
        // Just return config data and data models
        resolve(packageConfig);
    });
    // return packageConfig;
};