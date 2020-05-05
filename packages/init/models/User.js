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
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    type: Array,
  },
  lastLogin: {
    type: Date,
  },
});

/**
 * Registration
 */
module.exports = mongoose.model('User', userSchema);
