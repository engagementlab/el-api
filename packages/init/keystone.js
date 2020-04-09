const {
  Keystone,
} = require('@keystonejs/keystone');
const {
  MongooseAdapter,
} = require('@keystonejs/adapter-mongoose');
const {
  GraphQLApp,
} = require('@keystonejs/app-graphql');
const {
  AdminUIApp,
} = require('@keystonejs/app-admin-ui');
const {
  CloudinaryAdapter,
} = require('@keystonejs/file-adapters');

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: process.env.CLOUDINARY_DIR,
});

const KeystoneApp = (config, callback) => {
  const keystone = new Keystone({
    name: config.package.name,
    adapter: new MongooseAdapter({
      mongoUri: `mongodb://localhost/${config.package.database}`
    }),
  });

  // Initialize all models (lists) for this app
  // All models need access to KS Instance and cloudinary adapter
  config.models.forEach((model) => {
    model(keystone, cloudinaryAdapter);
  });

  keystone
    .prepare({
      apps: [new GraphQLApp({
        graphiqlPath: '/api/graphiql',
        adminPath: '/cms',
      }), new AdminUIApp({
        adminPath: '/cms',
        graphiqlPath: '/api/graphiql',
      })],
      dev: process.env.NODE_ENV !== 'production',
    })
    .then(async ({
      middlewares,
    }) => {
      await keystone.connect();
      callback(middlewares, keystone);
    });
};

module.exports = KeystoneApp;