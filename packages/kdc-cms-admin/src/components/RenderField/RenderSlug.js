import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import kebabCase from 'lodash.kebabcase';

const RenderSlug = ({ name, register, initialValue, setValue, errors }) => (
  <Input
    type="text"
    name={name}
    innerRef={register}
    defaultValue={initialValue}
    onChange={(e) => {
      const val = e.target.value;
      if (val && val.length > 0) {
        setValue(name, kebabCase(val));
      }
    }}
    invalid={errors[name] !== undefined}
  />
);

RenderSlug.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  errors: PropTypes.any,
};

export default RenderSlug;
