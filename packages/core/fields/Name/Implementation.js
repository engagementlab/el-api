const {
    GraphQLScalarType,
    GraphQLObjectType,
    GraphQLString,
    Kind,
} = require('graphql');
const {
    Text,
} = require('@keystonejs/fields');

// Using the text implementation because we're going to stringify the array of results.
// We could store this in another table, but this would require writing a complex controller.
// JSON.stringify feels good enough for this simple field.
class Name extends Text.implementation {
    constructor(path, spec) {
        super(...arguments);
        this.isOrderable = true;
    }

    gqlOutputFields() {
        return [`${this.path}: ${this.getTypeName()}`];
    }

    gqlOutputFieldResolvers() {
        return {
            [`${this.path}`]: item => {
                return item[this.path];
            },
        };
    }

    getTypeName() {
        return `Name`;
    }

    gqlQueryInputFields() {
        return [`${this.path}: ${this.getTypeName()}`];
    }

    get gqlUpdateInputFields() {
        return [`${this.path}: ${this.getTypeName()}`];
    }

    get gqlCreateInputFields() {
        return [`${this.path}: ${this.getTypeName()}`];
    }

    extendAdminMeta(meta) {
        return {
            ...meta,
        };
    }

    getGqlAuxTypes() {
        return [`scalar ${this.getTypeName()}`];
    }

    gqlAuxFieldResolvers() {
        return {
            Name: new GraphQLScalarType({
                name: this.getTypeName(),
                description: 'Name custom scalar represents an Object with keys {first, last}',
                parseValue(value) {

                    return JSON.stringify(value); // value from the client
                },
                serialize(value) {
                    console.log(value);
                    if (typeof value === 'string')
                        return JSON.parse(value);
                    return value;
                },
                parseLiteral(ast) {
                    if (ast.kind === Kind.STRING) {
                        return ast.value; // ast value is always in string format
                    }
                    return null;
                },
            }),
            /* 
            Name: new GraphQLObjectType({
                name: this.getTypeName(),
                fields: {
                    first: {
                        type: GraphQLString,
                    },
                    last: {
                        type: GraphQLString,
                    },
                    formatted: {
                        type: GraphQLString,
                        resolve(obj) {
                            return `${obj.first  } ${  obj.last}`;
                        },
                    },
                },
            }),
                  */
        };
    }
}

module.exports = {
    Implementation: Name,
    MongoIntegerInterface: Text.adapters.mongoose,
    KnexIntegerInterface: Text.adapters.knex,
};