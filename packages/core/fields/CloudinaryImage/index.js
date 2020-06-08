const {
  CloudinaryImage,
} = require('@keystonejs/fields');
const {
  Implementation,
  MongoIntegerInterface,
} = require('./Implementation');

module.exports = {
  type: 'CloudinaryImage',
  implementation: Implementation,
  views: {
    Controller: CloudinaryImage.views.Controller,
    Field: CloudinaryImage.views.Field,
    Cell: CloudinaryImage.views.Cell,
  },
  adapters: {
    mongoose: MongoIntegerInterface,
  },
};