/**
 * Engagement Lab URL Shortener
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Entry
 * ==========
 */
const {
    ApolloServer,
    ApolloError,
    gql,
} = require('apollo-server-express');

const {
    Auth,
    Passport,
    Server,
} = require('../core')(__dirname);

const path = require('path');
const colors = require('colors');
const express = require('express');
const RandExp = require('randexp');

const connection = require('./db')();
const Link = require('./Link')(connection);

/**
 * Instantiates Shortener's express server, apollo instance.
 * @name Shortener
 * @module
 */
const Shortener = () => {

    /**
     * App's GraphQL types
     */
    const TypeDefs = gql `
        type Link {
            id: ID!
            originalUrl: String
            shortUrl: String
            label: String
            clicks: Number
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
            addLink: async (_, args) => {
                try {
                    const response = await Link.create({
                        date: Date.now(),
                        ...args,
                    });
                    return response;
                } catch (e) {
                    return e;
                }
            },
        },
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
                const msg = err.extensions.exception.errmsg;
                let type = '';

                if (msg.indexOf('label_1') > -1) type = 'label';
                else if (msg.indexOf('originalUrl_1') > -1) type = 'url';
                else if (msg.indexOf('shortUrl_1') > -1) type = 'shorturl';

                return new ApolloError(type, 11000);
            }

            // Don't give the specific errors to the client.
            if (err.message.startsWith('Database Error: ')) {
                return new Error('Internal server error');
            }

            // Otherwise return the original error.  The error can also
            // be manipulated in other ways, so long as it's returned.
            return err;
        },
    });

    const app = express();
    const router = express.Router();

    // Mount apollo middleware (/graphql)
    router.use(Apollo.getMiddleware());

    // Passport init for router
    Passport(router);

    // Static files for production
    router.use('/static', express.static('client/build/static'));
    router.use('/manifest.json', (req, res) => res.sendFile(`${__dirname}/client/build/manifest.json`));
    router.get('/', Auth.isAllowed('/login'), (req, res) => {
        if (process.env.NODE_ENV !== 'production')
            res.send('Not prod');
        else
            res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });

    router.get('/generate', (req, res) => {
        // Generate random link in format of: 0-4 characters, mix of a-z and 0-9
        const shortUrl = new RandExp(/([a-z0-9]{4,4})/).gen().toLowerCase();

        res.send(shortUrl);
    });

    // Nginx rules sends all elab.works/ urls here
    router.get('/go/:shorturl', async (req, res) => {

        try {

            // Find original of by short url and increment clicks
            const data = await Link.findOneAndUpdate({
                shortUrl: req.params.shorturl,
            }, {
                $inc: {
                    clicks: 1,
                },
            }, {
                'fields': 'originalUrl',
            }).exec();

            // Send user to URL
            res.redirect(data.originalUrl);
        } catch (e) {
            res.status(500).send('Something went wrong redirecting you. Sorry!');
        }
    });

    /**
     * Authentication
     */
    router.get('/callback', Auth.callback);
    router.get('/login', Auth.login);


    /**
     * Get port from environment and store in Express.
     */
    const port = Server.normalizePort(process.env.PORT || '3000');

    app.use(router).listen(port);

    global.logger.info(`${colors.bgCyan.magenta.blue('Shortener')}: Ready on port ${port}.`);
};

module.exports = Shortener();