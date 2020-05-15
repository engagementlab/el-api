/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * User model
 */

const mongoose = require('mongoose');

const {
    Schema,
} = mongoose;

const userSchema = new Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String,
        isRequired: true,
    },
    email: {
        type: String,
        isRequired: true,
        unique: true,
        index: true,
    },
    permissions: {
        type: Array,
    },
    isAdmin: {
        type: Boolean,
    },
    lastLogin: {
        type: Date,
    },
});

/**
 * Registration
 */
module.exports = mongoose.model('User', userSchema);