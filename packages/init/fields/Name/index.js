const {
    Text,
} = require('@keystonejs/fields');
const {
    Implementation,
    MongoIntegerInterface,
    KnexIntegerInterface,
} = require('./Implementation');


module.exports = {
    type: 'Name',
    implementation: Implementation,
    views: {
        // Note: You cannot currently import and extend a controller
        // outside this monorepo.
        Controller: require.resolve('./views/Controller'),
        Field: require.resolve('./views/Field'),
        Filter: Text.views.Filter,
    },
    adapters: {
        mongoose: MongoIntegerInterface,
        knex: KnexIntegerInterface,
    },
};