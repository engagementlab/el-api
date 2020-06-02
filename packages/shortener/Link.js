/**
 * Engagement Lab URL Shortener
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * ==========
 */
//
const mongoose = require('mongoose');

const {
    Schema,
} = mongoose;

/**
 * Link mongoose model
 * @module
 * @param connection Mongoose connection to apply to
 * @returns {mongoose.Model} 
 */
module.exports = connection => {
    const linkSchema = new Schema({
        originalUrl: {
            type: String,
            index: true,
            unique: true,
            required: true,
        },
        shortUrl: {
            type: String,
            unique: true,
            required: true,
        },
        label: {
            type: String,
            unique: true,
            required: true,
        },
        date: {
            type: Date,
        },
        clicks: {
            type: Number,
        },
    });

    return connection.model('Link', linkSchema);
};