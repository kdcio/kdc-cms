import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const RenderText = ({ name, register, initialValue, onChange, errors }) => (
  <Input
    type="text"
    name={name}
    innerRef={register}
    defaultValue={initialValue}
    onChange={onChange}
    invalid={errors[name] !== undefined}
  />
);

RenderText.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  errors: PropTypes.any,
};

export default RenderText;
