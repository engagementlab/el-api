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

require('dotenv').config({
    path: `${__dirname}/.env`
});

const cloudinaryAdapter = new CloudinaryAdapter({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: process.env.CLOUDINARY_DIR
});

const KeystoneApp = (config) => {
    const dbAddress =
        process.env.NODE_ENV === 'development' ?
        `mongodb://localhost/${config.package.database}` :
        `${process.env.MONGO_CLOUD_URI}${config.package.database}?retryWrites=true&w=majority`;


    const keystone = new Keystone({
        name: config.package.name,
        schemaNames: ['home', 'test'],
        adapters: {
            home: new MongooseAdapter({
                mongoUri: dbAddress
            }),
            test: new MongooseAdapter({
                mongoUri: `mongodb://localhost/engagement-lab-test`
            })
        },
        defaultAdapter: 'home'
    });

    // Create an object of all models loaded and check for duplicate names/keys,
    // as this can cause issues in keystone's list adapter global,
    // and leads to CRUD operations for one model to occur in model instantiated
    // following another
    const allModels = {}

    // Initialize all models (lists) for this app
    // All models need access to KS Instance and cloudinary adapter
    const homeModels = require('../engagement-lab-home/models')();
    const testModels = require('../test/models')();
    const modelsMerged = [].concat(homeModels, testModels); // config.models, 

    modelsMerged.forEach(model => {

        let thisKey = model.name;
        // Check if model key already present
        if (Object.keys(allModels).indexOf(thisKey) > -1)
            thisKey = `${model().adapterName}__${thisKey}`

        allModels[thisKey] = model;

    });

    Object.keys(allModels).forEach(modelName => {
        const list = allModels[modelName](cloudinaryAdapter);

        // Initalize for schema being output to CMS only
        if (list.adapterName === 'home')
            keystone.createList(modelName, {
                fields: list.fields,
                ...list.options,
                adapterName: list.adapterName
            });
    });

    return {
        keystone,
        apps: [
            new AdminUIApp({
                apiPath: 'http://localhost:3000/api/?schema=el-home',
                graphiqlPath: '/api/graphiql',
                // TODO: cli arg
                schemaName: 'test'
            })
        ]
    };
};

module.exports = (() => {
    // Pass our route importer util to package
    const packageInit = require('../engagement-lab-home');
    const pkg = packageInit(null, true);

    // Export all models, routes, config for this app
    const bootConfig = {
        package: pkg.Config,
        models: pkg.Models
    };
    const ex = KeystoneApp(bootConfig);
    return ex;
})();