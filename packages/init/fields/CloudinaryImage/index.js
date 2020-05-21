const {
  CloudinaryImage,
} = require('@keystonejs/fields');
// const ImageBlock = require('./ImageBlock');

const {
  Implementation,
  MongoIntegerInterface,
  // KnexIntegerInterface,
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
    // knex: KnexIntegerInterface,
  },
  // blocks: {
  //   image: ImageBlock,
  // },
};