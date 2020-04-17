/**
 * TEST API
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

const fs = require('fs');
const routes = require('./routes');
const models = require('./models');

module.exports = (routesImporter) => {

  const dataFile = fs.readFileSync(`${__dirname}/config.json`);
  const configData = JSON.parse(dataFile);
  const pkgRouter = routes(routesImporter);

  const dbAddress =
    process.env.NODE_ENV === 'development' ?
    `mongodb://localhost/${configData.database}` :
    `${process.env.MONGO_CLOUD_URI}${configData.database}?retryWrites=true&w=majority`;

  const keystone = new Keystone({
    adapter: new MongooseAdapter({
      mongoUri: dbAddress
    })
  });

  keystone
    .prepare({
      apps: [new GraphQLApp()]
    })
    .then(() => {
      keystone.connect();
      // Tell package to use this graphql app for all queries
      pkgRouter.use((req, res, next) => {
        res.locals.db = keystone;
        next();
      });
    });

  // TODO: give all routes a namespace prefix, e.g. 'homepage/'
  return {
    Routes: pkgRouter,
    Models: models,
    Config: configData
  }
};