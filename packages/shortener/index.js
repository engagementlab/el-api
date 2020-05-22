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
    gql,
} = require('apollo-server-express');
const RandExp = require('randexp');
const express = require('express');

require('./db');
const {
    Link,
} = require('./Link');

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
      addLink(originalUrl: String!, label: String!): Link
    }
  `;

    const resolvers = {
        Query: {
            getLinks: async () => Link.find({}).exec(),
        },
        Mutation: {
            addLink: async (_, args) => {
                try {
                    // Generate random link in format of: 0-4 characters, mix of a-z and 0-9
                    const shortUrl = new RandExp(/([a-z0-9]\w{0,4})/).gen().toLowerCase();
                    const response = await Link.create({
                        shortUrl,
                        ...args,
                    });
                    console.log(response);
                    return response;
                } catch (e) {
                    console.error(e);
                    return e.message;
                }
            },
        },
    };

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const apollo = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const router = express.Router();

    // Mount apollo middleware (/graphql)
    router.use(apollo.getMiddleware());

    //   TODO: Serve build of react app on prod
    // if (process.env.NODE_ENV !== 'production')
    router.get('/', (req, res) => {
        res.send('Not prod');
    });

    return router;
};