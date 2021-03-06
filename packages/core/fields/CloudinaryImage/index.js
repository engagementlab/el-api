const {
    CloudinaryImage,
} = require('@keystonejs/fields-cloudinary-image');
const {
    Implementation,
    MongoIntegerInterface,
} = require('./Implementation');

console.log(CloudinaryImage);
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