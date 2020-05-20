import FieldController from '@keystonejs/fields/Controller';

export default class NameController extends FieldController {


  getFilterLabel = ({
    label
  }) => {
    console.log('label', label)
    return `${this.label}`;
  };

  formatFilter = ({
    label,
    value
  }) => {
    const valueNew = value.join(',')
    console.log(valueNew)
    return `${this.getFilterLabel({ label })}: "${valueNew}"`;
  };


  serialize = data => {
    if (data[this.path]) {
      return JSON.parse(data[this.path])
    } else return undefined;
  };

  deserialize = data => {
    if (data[this.path]) {
      return {
        first: data[this.path].first,
        last: data[this.path].last
      };
    } else return undefined;
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