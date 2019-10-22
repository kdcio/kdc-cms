import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const RenderDateTime = ({ name, register, initialValue, onChange }) => (
  <Input
    type="datetime-local"
    name={name}
    innerRef={register}
    defaultValue={initialValue}
    onChange={onChange}
  />
);

RenderDateTime.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default RenderDateTime;
