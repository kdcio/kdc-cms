import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const RenderBoolean = ({ name, register, initialValue, setValue }) => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    register({ name });
    setEnabled(initialValue);
    setValue(name, initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  return (
    <Input
      type="select"
      name={name}
      value={enabled}
      onChange={(e) => {
        setEnabled(e.target.value);
        setValue(name, e.target.value);
      }}
      style={{ display: 'inline', width: 'auto' }}
    >
      <option value="true">True</option>
      <option value="false">False</option>
    </Input>
  );
};
RenderBoolean.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  initialValue: PropTypes.any,
  errors: PropTypes.any,
};

export default RenderBoolean;
