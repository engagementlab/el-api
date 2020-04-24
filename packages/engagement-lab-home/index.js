/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */

const {
  MongoClient
} = require('mongodb');

const fs = require('fs');
const routes = require('./routes');
const models = require('./models')();

module.exports = (routesImporter) => new Promise(async resolve => {
  const dataFile = fs.readFileSync(`${__dirname}/config.json`);
  const configData = JSON.parse(dataFile);

  const dbAddress =
    process.env.NODE_ENV === 'development' ?
      'mongodb://localhost' :
      `${process.env.MONGO_CLOUD_URI}${configData.database}?retryWrites=true&w=majority`;

  const client = await MongoClient.connect(dbAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db(configData.database)

  const appRoutes = routes(routesImporter, db);
  global.logger.info('🚀 Homepage API ready.');

  // TODO: give all routes a namespace prefix, e.g. 'homepage/'
  resolve({
    Routes: appRoutes,
    Models: models,
    Config: configData
  });
});
