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
    schemaNames: ['home', 'test'],
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

  // Create an object of all models loaded and check for duplicate names/keys,
  // as this can cause issues in keystone's list adapter global,
  // and leads to CRUD operations for one model to occur in model instantiated
  // following another
  const allModels = {}

  // Initialize all models (lists) for this app
  // All models need access to KS Instance and cloudinary adapter
  const testModels = require('../test/models')();
  const modelsMerged = [].concat(config.models, testModels);

  modelsMerged.forEach(model => {

    let thisKey = model.name;
    // Check if model key already present
    // console.log('thisKey', thisKey, Object.keys(allModels))
    if (Object.keys(allModels).indexOf(thisKey) > -1)
      thisKey = `${model().adapterName}__${thisKey}`

    allModels[thisKey] = model;

  });

  Object.keys(allModels).forEach(modelName => {
    const list = allModels[modelName](cloudinaryAdapter);
    // TODO: not hard-code
    if (list.adapterName === 'home')
      keystone.createList(modelName, {
        fields: list.fields,
        ...list.options,
        adapterName: list.adapterName
      });
  });

  const apiPath = '/api';
  keystone
    .prepare({
      apps: [
        new AdminUIApp({
          adminPath: '/cms',
          apiPath: '/api/?schema=test',
          graphiqlPath: '/api/graphiql',
          schemaName: 'home'
        }),
        new SchemaRouterApp({
          apiPath,
          routerFn: (req) => {
            return (req.query && req.query.schema) ? req.query.schema : 'home';
          },
          apps: {
            home: new GraphQLApp({
              apiPath,
              schemaName: 'home'
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