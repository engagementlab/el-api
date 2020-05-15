import FieldController from '@keystonejs/fields/Controller';

export default class NameController extends FieldController {
  getFilterGraphQL = ({
    type,
    valueFirst
  }) => {
    const key = type === 'is_i' ? `${this.path}_i` : `${this.path}_${type}`;
    return `${key}: "${valueFirst}"`;
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
    return `${this.getFilterLabel({ label })}: "${value}"`;
  };
  getFilterTypes = () => [{
      type: 'contains_i',
      label: 'Contains',
      getInitialValue: () => '',
    },
    {
      type: 'not_contains_i',
      label: 'Does not contain',
      getInitialValue: () => '',
    },
    {
      type: 'is_i',
      label: 'Is exactly',
      getInitialValue: () => '',
    },
    {
      type: 'not_i',
      label: 'Is not exactly',
      getInitialValue: () => '',
    },
    {
      type: 'starts_with_i',
      label: 'Starts with',
      getInitialValue: () => '',
    },
    {
      type: 'not_starts_with_i',
      label: 'Does not start with',
      getInitialValue: () => '',
    },
    {
      type: 'ends_with_i',
      label: 'Ends with',
      getInitialValue: () => '',
    },
    {
      type: 'not_ends_with_i',
      label: 'Does not end with',
      getInitialValue: () => '',
    },
  ];
}