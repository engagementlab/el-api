/**
 * Engagement Lab URL Shortener
 * Developed by Engagement Lab, 202
 * @author Johnny Richardson
 * 
 */

// Mongoose config w/ promise
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const dbAddress =
    process.env.NODE_ENV !== 'production' ?
    process.env.MONGO_ADMIN_URI :
    process.env.MONGO_CLOUD_ADMIN_URI;

/**
 * Create DB connection for admin database, which contains links collection.
 * @name DB
 * @module
 */
module.exports = () => {
    try {

        const conn = mongoose.createConnection(dbAddress, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        mongoose.set('useCreateIndex', true);
        return conn;

    } catch (e) {
        global.logger.error(e);
        throw new Error(e);
    }
};