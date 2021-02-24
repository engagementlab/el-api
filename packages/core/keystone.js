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
    GraphQLPlaygroundApp,
} = require('@keystonejs/app-graphql-playground');
const {
    SchemaRouterApp,
} = require('@keystonejs/app-schema-router');
const {
    AdminUIApp,
} = require('@keystonejs/app-admin-ui');
const CloudinaryAdapter = require('./adapters/Cloudinary');

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
    folder: process.env.CLOUDINARY_DIR,
});
const apiPath = '/ql';

const KeystoneApp = (ksConfig, callback) => {
    // Retrieve info for all packages
    const packages = utils.GetPackagesData();
    // Array to hold all model references
    const modelsMerged = [];
    // All admin UI apps
    const adminApps = [];
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
        const appPackage = packageInit({
            dbPrefix: ksConfig.dbPrefix,
            skipRoutes: true,
        });

        // Export models, config for this app
        const config = {
            package: appPackage.Config,
            models: appPackage.Models,
        };

        const schemaName = config.package.schema;
        const dbAddress = `${ksConfig.dbPrefix}${config.package.database}?retryWrites=true&w=majority`;

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
            mongoUri: dbAddress,
        });

        // Assign schema app
        schemaApps[schemaName] = new GraphQLApp({
            apiPath,
            schemaName,
        });

        // Create admin UI app if on dev
        adminApps.push(
            new AdminUIApp({
                adminPath: `/cms/${schemaName}`,
                apiPath: `/ql/?schema=${schemaName}`,
                schemaName,
            })
        );
    });

    const keystone = new Keystone({
        // Name of CMS to load in dev instance
        name: ksConfig.package.name,
        schemaNames: Object.keys(schemaAdapters).concat(['public']),
        adapters: schemaAdapters,
        defaultAdapter: Object.keys(schemaAdapters)[0],
        cookieSecret: process.env.SESSION_COOKIE,
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
            thisKey = `${model.adapterName.replace(/-/g, '')}__${thisKey}`;
        }
        allLists[thisKey] = model;
    });

    Object.keys(allLists).forEach(modelName => {
        const list = allLists[modelName];
        // TODO: not hard-code and enable only on dev
        keystone.createList(modelName, {
            fields: list.fields,
            ...list.options,
            adapterName: list.adapterName,
        });
    });

    const ksApps = [
        new SchemaRouterApp({
            apiPath,
            // Direct each front-end req to respective schema
            routerFn: req => ((req.query && req.query.schema) ? req.query.schema : 'home'),
            apps: schemaApps,
        })
    ];
    const playgroundApp =
        new GraphQLPlaygroundApp({
            graphiqlPath: '/graphiql',
            apiPath: `http://localhost:3000/ql/?schema=home`,
            schemaName: 'home',
        });

    // Include admin UI and graphiql playground if on dev instance
    if (process.env.NODE_ENV === 'development') {
        Array.prototype.push.apply(ksApps, adminApps);
        Array.prototype.push.apply(ksApps, [playgroundApp]);
    }

    keystone
        .prepare({
            apps: ksApps,
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