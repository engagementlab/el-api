const mongoose = require('mongoose');

const {
    Schema,
} = mongoose;

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

const Link = mongoose.model('Link', linkSchema);

module.exports = {
    Link,
};