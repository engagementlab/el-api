/**
 * Engagement Lab Content and Data API content API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */

const fs = require('fs');
const routes = require('./routes');
const models = require('./models');

module.exports = {
  Routes: routes,
  Models: models,
  Config: () => {
    const data = fs.readFileSync(`${__dirname}/config.json`);
    return JSON.parse(data);
  }
};