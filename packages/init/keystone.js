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

// Build utils
const utils = require('./build/utils')();

/* 
    The API backend for CMS needs all possible lists in-memory,
    so we have to load all models for all packages.

    Create an object of all models loaded and check for duplicate names/keys,
    as this can cause issues in keystone's list adapter global,
    and leads to CRUD operations for one model to occur in model instantiated
    following another.
*/
const allLists = {};

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: process.env.CLOUDINARY_DIR
});
const apiPath = '/cms/api';

const KeystoneApp = (ksConfig, callback) => {

  // Retrieve info for all packages
  const packages = utils.GetPackagesData();
  // Array to hold all model references
  const modelsMerged = [];
  // All schemas
  const schemaAdapters = {};
  // All schema (graphql) apps
  const schemaApps = {};

  // For all packages...
  const keys = Object.keys(packages);
  keys.forEach(pkgKey => {
    const packagePath = `../${packages[pkgKey].dir}`;
    const packageInit = require(packagePath);

    // Load all data for API of currently used package
    const appPackage = packageInit(null, true);

    // Export models, config for this app
    const config = {
      package: appPackage.Config,
      models: appPackage.Models
    };

    const schemaName = config.package.schema;
    const dbAddress =
      process.env.NODE_ENV === 'development' ?
      `mongodb://localhost/${config.package.database}` :
      `${process.env.MONGO_CLOUD_URI}${config.package.database}?retryWrites=true&w=majority`;

    // Add instantiated model to array of all
    config.models.forEach(modelFunc => {
      // All models need access to cloudinary adapter
      const modelObj = modelFunc(cloudinaryAdapter);
      // Apply adapterName to all models based on respective schemaName
      modelObj.adapterName = schemaName;
      // Apply 'name' of model from it's function's name, for later key creation
      modelObj.name = modelFunc.name;

      modelsMerged.push(modelObj);
    });

    // Assign mongoose adapter for app
    schemaAdapters[schemaName] = new MongooseAdapter({
      mongoUri: dbAddress
    });

    // Assign schema app
    schemaApps[schemaName] = new GraphQLApp({
      apiPath,
      schemaName
    });
  });

  const keystone = new Keystone({
    // Name of CMS to load in dev instance
    name: ksConfig.package.name,
    schemaNames: Object.keys(schemaAdapters),
    adapters: schemaAdapters,
    defaultAdapter: Object.keys(schemaAdapters)[0]
  });

  // Create an object of all models loaded and check for duplicate names/keys,
  // as this can cause issues in keystone's list adapter global,
  // and leads to CRUD operations for one model to occur in model instantiated
  // following another


  modelsMerged.forEach(model => {
    let thisKey = model.name;
    // Check if model key already present in global CMS lists
    if (Object.keys(allLists).indexOf(thisKey) > -1) {
      // If present, mutate key w/ adaptername prefix
      thisKey = `${model.adapterName}__${thisKey}`;
    }
    allLists[thisKey] = model;
  });

  Object.keys(allLists).forEach(modelName => {
    const list = allLists[modelName];
    // TODO: not hard-code and enable only on dev
    // if (list.adapterName === 'test')
    keystone.createList(modelName, {
      fields: list.fields,
      ...list.options,
      adapterName: list.adapterName
    });
  });

  const ksApps = [
    new SchemaRouterApp({
      apiPath,
      // Direct each front-end req to respective schema
      routerFn: (req) => {
        return (req.query && req.query.schema) ? req.query.schema : 'home';
      },
      apps: schemaApps
    }),
  ];

  // Include admin UI if on dev instance
  // if (process.env.NODE_ENV === 'development')
  //   ksApps.push(
  //     new AdminUIApp({
  //       adminPath: '/cms',
  //       apiPath: '/cms/api/?schema=test',
  //       graphiqlPath: '/api/graphiql',
  //       schemaName: 'test'
  //     })
  //   );

  keystone
    .prepare({
      apps: ksApps,
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