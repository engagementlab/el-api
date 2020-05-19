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
    console.log('serialize', data[this.path])
    console.trace()

    if (data[this.path]) {
      return {
        first: data[this.path].first,
        last: data[this.path].last
      };
    } else return undefined;
  };

  deserialize = data => {
    console.log('deserialize', data)

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