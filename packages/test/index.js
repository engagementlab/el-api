/**
 * *test* API
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

module.exports = routesImporter => {
  const dataFile = fs.readFileSync(`${__dirname}/config.json`);
  const configData = JSON.parse(dataFile);

  const dbAddress =
    process.env.NODE_ENV === 'development' ?
    'mongodb://localhost' :
    `${process.env.MONGO_CLOUD_URI}${configData.database}?retryWrites=true&w=majority`;

  console.log('mods', models)
  return {
    // Routes: appRoutes,
    Models: models,
    Config: configData
  }
};