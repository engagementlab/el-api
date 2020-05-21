const {
    File,
} = require('@keystonejs/fields');
// const Cell = require('@keystonejs/fields/src/types/File/views/Cell');
const {
    Implementation,
    MongoIntegerInterface,
    KnexIntegerInterface,
} = require('./Implementation');


module.exports = {
    type: 'CustomFile',
    implementation: Implementation,
    views: {
        Cell: File.views.Cell,
        Controller: File.views.Controller,
        Field: File.views.Field,
        Filter: File.views.Filter,
    },
    adapters: {
        mongoose: MongoIntegerInterface,
        knex: KnexIntegerInterface,
    },
};