const mongoose = require('mongoose');

const {
    Schema,
} = mongoose;

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
    });

    return connection.model('Link', linkSchema);
};