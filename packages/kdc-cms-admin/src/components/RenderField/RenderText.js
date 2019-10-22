import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const RenderText = ({ name, register, initialValue, onChange }) => (
  <Input
    type="text"
    name={name}
    innerRef={register}
    defaultValue={initialValue}
    onChange={onChange}
  />
);

RenderText.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default RenderText;
