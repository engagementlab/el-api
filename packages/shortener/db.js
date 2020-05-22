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

const url = 'mongodb://localhost:27017/el-admin';

try {

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

} catch (e) {
    global.logger.error(e);
    throw new Error(e);
}