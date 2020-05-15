const inflection = require('inflection');
const {
  Text,
} = require('@keystonejs/fields');

// Using the text implementation because we're going to stringify the array of results.
// We could store this in another table, but this would require writing a complex controller.
// JSON.stringify feels good enough for this simple field.
class Name extends Text.implementation {
  constructor(path) {
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
    return `${this.listKey}${inflection.classify(this.path)}Type`;
  }

  gqlQueryInputFields() {
    return [
      ...this.equalityInputFields('String'),
      ...this.stringInputFields('String'),
      ...this.inInputFields('String')
    ];
  }

  get gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }

  // get gqlCreateInputFields() {
  //   return [`${this.path}: Name`];
  // }

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