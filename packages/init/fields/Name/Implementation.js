const inflection = require('inflection');
const {
  Text,
} = require('@keystonejs/fields');

// Using the text implementation because we're going to stringify the array of results.
// We could store this in another table, but this would require writing a complex controller.
// JSON.stringify feels good enough for this simple field.
class Name extends Text.implementation {
  constructor(path, spec) {
    console.trace();

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
    console.log(this);
    return [
      `${this.path}: String`
      // Create a graphQL query for each individual option
      // ...this.options.map(option => `${this.path}_${option}: Boolean`)
    ];
  }

  get gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }

  get gqlCreateInputFields() {
    return [`${this.path}: String`];
  }

  getGqlAuxTypes() {
    return [
      `
      type ${this.getTypeName()} {
        first: String
        last: String
      }
    `
    ];
  }

  extendAdminMeta(meta) {
    return {
      ...meta,
    };
  }
}

module.exports = {
  Implementation: Name,
  MongoIntegerInterface: Text.adapters.mongoose,
  KnexIntegerInterface: Text.adapters.knex,
};