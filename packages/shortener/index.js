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

require('./db');
const {
    Link,
} = require('./Link');

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
      addLink(originalUrl: String!, Label: String!): Link
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
                    const shortUrl = new RandExp(/([a-z0-9]\w{0,3})/).gen();
                    const response = await Link.create({
                        shortUrl,
                        ...args,
                    });
                    return response;
                } catch (e) {
                    return e.message;
                }
            },
        },
    };

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    return server.getMiddleware({
        path: '/shortener/graphql',
    });

    //   // The `listen` method launches a web server.
    //   app.listen().then(({ url }) => {
    //     console.log(`🚀  Server ready at ${url}`);
    //   });
};