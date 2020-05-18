import FieldController from '@keystonejs/fields/Controller';

export default class NameController extends FieldController {
  getFilterGraphQL = ({
    type,
    value
  }) => {
    const key = type === 'is_i' ? `${this.path}_i` : `${this.path}_${type}`;
    const valueNew = value.join(',')
    return `${key}: "${valueNew}"`;
  };
  getFilterLabel = ({
    label
  }) => {
    return `${this.label} ${label.toLowerCase()}`;
  };
  formatFilter = ({
    label,
    value
  }) => {
    const valueNew = value.join(',')

    return `${this.getFilterLabel({ label })}: "${valueNew}"`;
  };
  getQueryFragment = () => `
    ${this.path} {
      first
      last
  }`;

  deserialize = data => {
    return data[this.path];
  };

  getFilterTypes = () => [{
    type: 'is',
    label: 'Matches',
    getInitialValue: () => ({
      first: 'None',
      last: 'None',
    }),
  }, ];
}