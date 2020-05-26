/**
 * Engagement Lab URL Shortener
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Database connnection
 * ==========
 */
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const url = 'mongodb://localhost/elab-admin';
module.exports = () => {
    try {

        const conn = mongoose.createConnection(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose.set('useCreateIndex', true);
        return conn;

    } catch (e) {
        global.logger.error(e);
        throw new Error(e);
    }
};