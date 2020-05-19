const {
    GraphQLScalarType,
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
            [`${this.path}`]: item => item[this.path],
        };
    }

    getTypeName() {
        return `Name`;
    }

    gqlQueryInputFields() {
        return [
            `${this.path}: ${this.getTypeName()}`
        ];
    }

    get gqlUpdateInputFields() {
        return [`${this.path}: ${this.getTypeName()}`];
    }

    get gqlCreateInputFields() {

        return [`${this.path}: ${this.getTypeName()}`];
    }

    getGqlAuxTypes() {
        return [`scalar ${this.getTypeName()}`];
    }

    extendAdminMeta(meta) {
        return {
            ...meta,
        };
    }

    gqlAuxFieldResolvers() {
        return {
            Name: new GraphQLScalarType({
                name: this.getTypeName(),
                description: 'Name custom scalar represents an Object with keys {first, last}',
                parseValue(value) {
                    console.log('parse', value);
                    return value; // value from the client
                },
                serialize(value) {
                    console.log('serialize', value);
                    return value; // value sent to the client
                },
                parseLiteral(ast) {
                    console.log('lit', ast);

                    if (ast.kind === Kind.STRING) {
                        return ast.value; // ast value is always in string format
                    }
                    return null;
                },
            }),
        };
    }
}

module.exports = {
    Implementation: Name,
    MongoIntegerInterface: Text.adapters.mongoose,
    KnexIntegerInterface: Text.adapters.knex,
};