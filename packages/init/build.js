// SUPER EXPERIMENTAL

const {
    Keystone
} = require('@keystonejs/keystone');
const {
    MongooseAdapter
} = require('@keystonejs/adapter-mongoose');
const {
    GraphQLApp
} = require('@keystonejs/app-graphql');
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

const KeystoneApp = (config, callback) => {
    const dbAddress =
        process.env.NODE_ENV === 'development' ?
        `mongodb://localhost/${config.package.database}` :
        `${process.env.MONGO_CLOUD_URI}${config.package.database}?retryWrites=true&w=majority`;

    const keystone = new Keystone({
        name: config.package.name,
        adapter: new MongooseAdapter({
            mongoUri: dbAddress
        })
    });

    // Initialize all models (lists) for this app
    // All models need access to KS Instance and cloudinary adapter
    config.models.forEach(model => {
        model(keystone, cloudinaryAdapter);
    });

    return {
        keystone,
        apps: [new AdminUIApp({
            apiPath: 'http://localhost:3000/cms/api',
            graphiqlPath: '/api/graphiql'
        })]
    };
};

module.exports = function () {

    // Pass our route importer util to package
    const packageInit = require('../engagement-lab-home');
    const pkg = packageInit();

    // Export all models, routes, config for this app
    const bootConfig = {
        package: pkg.Config,
        models: pkg.Models,
    };
    const ex = KeystoneApp(bootConfig);
    return ex;
}()