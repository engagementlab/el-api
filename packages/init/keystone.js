const {
  Keystone
} = require('@keystonejs/keystone');
const {
  MongooseAdapter
} = require('@keystonejs/adapter-mongoose');
const {
  GraphQLApp
} = require('@keystonejs/app-graphql');
const {
  SchemaRouterApp
} = require('@keystonejs/app-schema-router');
const {
  AdminUIApp
} = require('@keystonejs/app-admin-ui');
const {
  CloudinaryAdapter
} = require('@keystonejs/file-adapters');

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: process.env.CLOUDINARY_DIR
});

const KeystoneApp = (config, callback) => {
  const dbAddress =
    process.env.NODE_ENV === 'development' ?
    `mongodb://localhost/${config.package.database}` :
    `${process.env.MONGO_CLOUD_URI}${config.package.database}?retryWrites=true&w=majority`;

  const keystone = new Keystone({
    name: config.package.name,
    schemaNames: ['el-home', 'test'],
    adapters: {
      home: new MongooseAdapter({
        mongoUri: dbAddress
      }),
      test: new MongooseAdapter({
        mongoUri: `mongodb://localhost/engagement-lab-test`
      })
    },
    defaultAdapter: 'home'
  });

  // Initialize all models (lists) for this app
  // All models need access to KS Instance and cloudinary adapter
  config.models.forEach(model => {
    model(keystone, cloudinaryAdapter);
  });
  const testModels = require('../test/models')();
  testModels.forEach(model => {
    model(keystone, cloudinaryAdapter);
  });
  const apiPath = '/api';
  keystone
    .prepare({
      apps: [
        new SchemaRouterApp({
          apiPath,
          routerFn: (req) => {
            return (req.query && req.query.schema) ? req.query.schema : 'el-home';
          },
          apps: {
            'el-home': new GraphQLApp({
              apiPath,
              schemaName: 'el-home'
            }),
            test: new GraphQLApp({
              apiPath,
              schemaName: 'test'
            })
          },
        }),
      ],
      dev: process.env.NODE_ENV !== 'production'
    })
    .then(async ({
      middlewares
    }) => {
      await keystone.connect();
      callback(middlewares, keystone);
    });
};

module.exports = KeystoneApp;