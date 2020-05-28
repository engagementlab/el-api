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
const RandExp = require('randexp');
const express = require('express');

const connection = require('./db')();
const Link = require('./Link')(connection);

/**
 * Instantiate schema and return app router.
 * @function
 * @returns express.Router
 *
 */
module.exports = () => {
    const typeDefs = gql `
    type Link {
      id: ID!
      originalUrl: String
      shortUrl: String
      label: String
    }
    type Query {
      getLinks: [Link]
    }
    type Mutation {
      addLink(originalUrl: String!, shortUrl: String!, label: String!): Link
    }
  `;

    const resolvers = {
        Query: {
            getLinks: async () => Link.find({}).sort({'date': 'desc'}).exec(),
        },
        Mutation: {
            addLink: async (_, args) => {
                try {
                    const response = await Link.create({date: Date.now(), ...args});
                    return response;
                } catch (e) {
                    return e;
                }
            },
        },
    };

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const apollo = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: err => {

            // Dupe index errors
            if (err.extensions && err.extensions.exception.code === 11000) {
                const msg = err.extensions.exception.errmsg;
                let type = '';

                if (msg.indexOf('label_1') > -1)
                    type = 'label';
                else if (msg.indexOf('originalUrl_1') > -1)
                    type = 'url';
                else if (msg.indexOf('shortUrl_1') > -1)
                    type = 'shorturl';

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

    const router = express.Router();

    // Mount apollo middleware (/graphql)
    router.use(apollo.getMiddleware());

    //   TODO: Serve build of react app on prod
    // if (process.env.NODE_ENV !== 'production')
    router.get('/', (req, res) => {
        res.send('Not prod');
    });

    router.get('/generate', (req, res) => {
        // Generate random link in format of: 0-4 characters, mix of a-z and 0-9
        const shortUrl = new RandExp(/([a-z0-9]{4,4})/).gen().toLowerCase();

        res.send(shortUrl);
    });

    //   Nginx rules sends all elab.works/ urls here
    router.get('/go/:url', (req, res) => {
        // TODO: Do redirect here.
    });

    return router;
};