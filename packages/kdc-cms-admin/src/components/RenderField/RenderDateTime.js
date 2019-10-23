import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const RenderDateTime = ({ name, register, initialValue, onChange, errors }) => (
  <Input
    type="datetime-local"
    name={name}
    innerRef={register}
    defaultValue={initialValue}
    onChange={onChange}
    invalid={errors[name] !== undefined}
  />
);

RenderDateTime.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.any,
};

export default RenderDateTime;
