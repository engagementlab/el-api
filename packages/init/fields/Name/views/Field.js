
/** @jsx jsx */

import { jsx } from '@emotion/core';

import { FieldContainer, FieldLabel, FieldDescription, FieldInput } from '@arch-ui/fields';
import { Input } from '@arch-ui/input';

const TextField = ({ onChange, autoFocus, field, errors, value: serverValue }) => {
  const handleChangeFirst = event => {
    onChange(event.target.value);
  };
  const handleChangeLast = event => {
    onChange(event.target.value);
  };
  
  const value = serverValue || '';
  const canRead = errors.every(
    error => !(error instanceof Error && error.name === 'AccessDeniedError')
  );
  const error = errors.find(error => error instanceof Error && error.name === 'AccessDeniedError');

  return (
    <FieldContainer>
      <FieldLabel field={field} errors={errors} />
      <FieldDescription text={field.adminDoc} />
      <FieldInput>
        <Input
          autoComplete="off"
          autoFocus={autoFocus}
          type="text"
          value={canRead ? value.first : undefined}
          placeholder={canRead ? `First`: error.message}
          onChange={handleChangeFirst}
          id={`ks-input-name-first`}
        />
        <Input
        autoComplete="off"
        type="text"
        value={canRead ? value.last : undefined}
        placeholder={canRead ? `Last`: error.message}
        onChange={handleChangeLast}
        id={`ks-input-name-last`}
      />
      </FieldInput>
    </FieldContainer>
  );
};

export default TextField;