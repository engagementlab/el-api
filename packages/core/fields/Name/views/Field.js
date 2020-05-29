
/** @jsx jsx */

import { jsx } from '@emotion/core';
import { useState, useEffect } from 'react';

import { FieldContainer, FieldLabel, FieldDescription, FieldInput } from '@arch-ui/fields';
import { Input } from '@arch-ui/input';

const TextField = ({ onChange, autoFocus, field, errors, value: serverValue }) => {
  
  const initialState = serverValue ? serverValue : {first: undefined, last: undefined};
  
  const [values, setValues] = useState(initialState);
  useEffect(() => {
    onChange(values);
  }, [values]);

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
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
          name="first"
          value={canRead ? values.first : undefined}
          placeholder={canRead ? `First`: error.message}
          onChange={handleChange}
          id={`ks-input-name-first`}
        />
        <Input
        autoComplete="off"
        type="text"
        name="last"
        value={canRead ? values.last : undefined}
        placeholder={canRead ? `Last`: error.message}
        onChange={handleChange}
        id={`ks-input-name-last`}
      />
      </FieldInput>
    </FieldContainer>
  );
};

export default TextField;