/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */

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
    CloudinaryAdapter
} = require('@keystonejs/file-adapters');

const cloudinaryAdapter = new CloudinaryAdapter({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: process.env.CLOUDINARY_DIR
});


const fs = require('fs');
const routes = require('./routes');
const models = require('./models')();

module.exports = async (routesImporter) => {
    return new Promise((resolve) => {
        const dataFile = fs.readFileSync(`${__dirname}/config.json`);
        const configData = JSON.parse(dataFile);
        // const pkgRouter = 

        const dbAddress =
            process.env.NODE_ENV === 'development' ?
            `mongodb://localhost/${configData.database}` :
            `${process.env.MONGO_CLOUD_URI}${configData.database}?retryWrites=true&w=majority`;

        const keystone = new Keystone({
            adapter: new MongooseAdapter({
                mongoUri: dbAddress
            })
        });

        // Initialize all models (lists) for this app
        models.forEach(model => {
            model(keystone, cloudinaryAdapter);
        });

        keystone
            .prepare({
                apps: [new GraphQLApp()]
            })
            .then(() => {
                keystone.connect();
                const appRoutes = routes(routesImporter, keystone)
                global.logger.info('Homepage API ready.');

                // TODO: give all routes a namespace prefix, e.g. 'homepage/'
                resolve({
                    Routes: appRoutes,
                    Models: models,
                    Config: configData
                });
            });
    });

};