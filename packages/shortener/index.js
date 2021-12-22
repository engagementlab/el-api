/**
 * Engagement Lab URL Shortener
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */
const { GraphQLScalarType } = require('graphql');
const { ApolloServer, ApolloError, gql } = require('apollo-server-express');

const { Auth, Passport, Server } = require('@engagementlab/core')(__dirname);

const path = require('path');
const colors = require('colors');
const express = require('express');
const RandExp = require('randexp');

const { Analytics } = require('analytics');
const googleAnalytics = require('@analytics/google-analytics').default;

const connection = require('./db')();
const Link = require('./Link')(connection);

/**
 * Custom scalar type for Dates in schema
 */
const DateType = new GraphQLScalarType({
    name: 'Date',
    description: 'Date and time field.',
    serialize(value) {
        const result = new Date(value).toDateString();
        return result;
    },
});

/**
 * Instantiates Shortener's express server, apollo instance.
 * @name Shortener
 * @module
 */
const Shortener = () => {
    /**
   * Analytics
   */
    const analytics = Analytics({
        app: 'Engagement Lab Website',
        version: 2.5,
        plugins: [
            googleAnalytics({
                trackingId: process.env.GA_TRACKING_ID,
            }),
        ],
    });

    /**
   * App's GraphQL types
   */
    const TypeDefs = gql`
    scalar Date

    type Link {
      id: ID!
      originalUrl: String
      shortUrl: String
      label: String
      clicks: Int
      user: String
      date: Date
    }
    type Query {
      getLinks: [Link]
    }
    type Mutation {
      addLink(originalUrl: String!, shortUrl: String!, label: String!): Link
    }
  `;

    /**
   * App's GraphQL resolvers
   */
    const Resolvers = {
        Query: {
            getLinks: async () =>
                Link.find({})
                    .sort({
                        date: 'desc',
                    })
                    .exec(),
        },
        Mutation: {
            addLink: async (_, args, context) => {
                try {
                    const response = await Link.create({
                        date: Date.now(),
                        // Cache name of user adding
                        user: context.userName,
                        ...args,
                    });
                    return response;
                } catch (e) {
                    return e;
                }
            },
        },
        Date: DateType,
    };

    /**
   * App's Apollo server instance
   */
    const Apollo = new ApolloServer({
        typeDefs: TypeDefs,
        resolvers: Resolvers,
        formatError: err => {
            // Dupe index errors
            if (err.extensions && err.extensions.exception.code === 11000) {
                let msg = err.extensions.exception.errmsg;
                // if no errmsg, try keypattern
                if (!msg) msg = Object.keys(err.extensions.exception.keyPattern);
                let type = '';

                if (msg.indexOf('label') > -1 || msg.indexOf('label_1') > -1)
                    type = 'label';
                else if (
                    msg.indexOf('originalUrl') > -1 ||
                        msg.indexOf('originalUrl_1') > -1
                )
                    type = 'url';
                else if (msg.indexOf('shortUrl') > -1 || msg.indexOf('shortUrl_1') > -1)
                    type = 'shorturl';

                return new ApolloError(type, 11000);
            }

            // Don't give the specific errors to the client.
            if (err.message.startsWith('Database Error: ')) {
                return new Error('Internal server error');
            }

            // Otherwise return the original error.  The error can also
            // be manipulated in other ways, so long as it's returned.
            global.logger.error(err);
            return err;
        },
        context: ({ req }) => {
            // Get logged in user's name per QL execution on non-dev
            let userName = null;
            if (process.env.NODE_ENV !== 'development')
                userName = req.user ? req.user.name : null;

            return {
                userName,
            };
        },
    });

    const app = express();
    const router = express.Router();

    // Passport init for router
    Passport(router);

    // Mount apollo middleware (/graphql)
    router.use(Apollo.getMiddleware());

    // Static files for production
    router.use('/static', express.static('client/build/static'));
    router.use('/manifest.json', (req, res) =>
        res.sendFile(`${__dirname}/client/build/manifest.json`)
    );
    router.get('/admin', Auth.isAllowed('/admin/login'), (req, res) => {
        if (process.env.NODE_ENV !== 'production') res.send('Not prod');
        else res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });

    router.get('/generate', (req, res) => {
    // X-origin
        res.header(
            'Access-Control-Allow-Origin',
            `http://localhost:${process.env.PORT_CLIENT}`
        );
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method'
        );

        // Generate random link in format of: 0-4 characters, mix of a-z and 0-9
        const shortUrl = new RandExp(/([a-z0-9]{4,4})/).gen().toLowerCase();

        res.send(shortUrl);
    });

    // Short url redirect
    router.get('/:shorturl', async (req, res) => {
        try {
            // Find original of by short url and increment clicks
            const data = await Link.findOneAndUpdate(
                {
                    shortUrl: req.params.shorturl,
                },
                {
                    $inc: {
                        clicks: 1,
                    },
                },
                {
                    fields: 'originalUrl label',
                }
            ).exec();

            // Track click in GA
            analytics.track('Shortener Click', {
                label: data.label,
                url: data.originalUrl,
            });

            // Send user to URL
            res.redirect(data.originalUrl);
        } catch (e) {
            res
                .status(500)
                .send(
                    `Something went wrong redirecting you. It appears there is no redirect for "${req.params.shorturl}". Sorry!`
                );
        }
    });

    /**
   * Authentication
   */
    router.get('/admin/callback', Auth.callback);
    router.get('/admin/login', Auth.login);

    /**
   * Get port from environment and store in Express.
   */
    const port = Server.normalizePort(process.env.PORT || '3001');

    app.use(router).listen(port);

    global.logger.info(
        `${colors.bgCyan.magenta.blue('Shortener')}: Ready on port ${port}.`
    );
};

module.exports = Shortener();
