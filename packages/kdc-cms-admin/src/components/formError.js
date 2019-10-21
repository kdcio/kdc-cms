import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';

const FormError = ({ errors, name }) => {
  if (!errors[name]) return null;

  const { type, message } = errors[name];

  if (message) {
    return <FormFeedback style={{ display: 'block' }}>{message}</FormFeedback>;
  }

  if (type === 'required') {
    return <FormFeedback style={{ display: 'block' }}>This field is required</FormFeedback>;
  }

  return null;
};

FormError.propTypes = {
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default FormError;
