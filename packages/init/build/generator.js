const {
    Keystone
} = require('@keystonejs/keystone');
const {
    MongooseAdapter
} = require('@keystonejs/adapter-mongoose');
const {
    AdminUIApp
} = require('@keystonejs/app-admin-ui');
const {
    CloudinaryAdapter
} = require('@keystonejs/file-adapters');

const colors = require('colors');

// Load env
require('dotenv').config({
    path: `${__dirname}/../.env`
});

/* 
    Since the production backend will have all possible CMS lists in-memory,
    we have to load all models for all packages.

    Create an object of all models loaded and check for duplicate names/keys,
    as this can cause issues in keystone's list adapter global,
    and leads to CRUD operations for one model to occur in model instantiated
    following another.
*/
const allLists = {};

// Cloudinary config
const cloudinaryAdapter = new CloudinaryAdapter({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: process.env.CLOUDINARY_DIR
});

// Load logger
require('../logger');


const CmsBuild = (currentApp, allApps) => {
    // Array to hold all model references
    const modelsMerged = [];
    let currentAppConfig = {};
    const schemaAdapters = {};

    global.logger.simple.info(`Starting build for ${colors.yellow(currentApp)}.`);

    allApps.forEach(appName => {

        const packagePath = `@engagementlab/${appName}`;
        const packageInit = require(packagePath);
        // Load all data for API of currently used package
        const appPackage = packageInit(null, true);

        // Export models, config for this app
        const config = {
            package: appPackage.Config,
            models: appPackage.Models
        };

        // TODO: APPLY adapterName to all models

        // If this is app being exported to CMS, cache
        if (appName === currentApp) currentAppConfig = config;

        const schemaName = config.package.schema || 'test';
        const dbAddress =
            process.env.NODE_ENV === 'development' ?
            `mongodb://localhost/${config.package.database}` :
            `${process.env.MONGO_CLOUD_URI}${config.package.database}?retryWrites=true&w=majority`;

        // Add to array of all
        config.models.forEach(model => {
            modelsMerged.push(model);
        });

        // Assign mongoose adapter for app
        schemaAdapters[schemaName] = new MongooseAdapter({
            mongoUri: dbAddress
        });
    });

    const keystone = new Keystone({
        name: currentAppConfig.package.name,
        schemaNames: Object.keys(schemaAdapters),
        adapters: schemaAdapters,
        defaultAdapter: Object.keys(schemaAdapters)[0]
    });

    modelsMerged.forEach(model => {
        let thisKey = model.name;
        // Check if model key already present in global CMS lists
        if (Object.keys(allLists).indexOf(thisKey) > -1)
            thisKey = `${model().adapterName}__${thisKey}`;
        allLists[thisKey] = model;
    });

    Object.keys(allLists).forEach(modelName => {
        // All models need access to KS Instance and cloudinary adapter
        const list = allLists[modelName](cloudinaryAdapter);

        // Initalize for schema being output to CMS only
        if (list.adapterName === currentAppConfig.package.schema) {
            keystone.createList(modelName, {
                fields: list.fields,
                ...list.options,
                adapterName: list.adapterName
            });
        }
    });
    global.logger.simple.info(`📣 Starting CMS build for ${colors.yellow(currentAppConfig.package.name)}.`);

    return {
        keystone,
        apps: [
            new AdminUIApp({
                apiPath: `http://localhost:3000/api/?schema=${currentAppConfig.package.schema}`,
                graphiqlPath: '/api/graphiql',
                schemaName: currentAppConfig.package.schema
            })
        ]
    };
};

module.exports = (() => {

    const {
        argv
    } = require('yargs');
    const build = CmsBuild(argv.app, argv.allApps.split(','));
    return build;

})();