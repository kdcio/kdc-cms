import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

const RowSpinner = ({ colSpan }) => (
  <tr colSpan={colSpan}>
    <td colSpan="6" className="text-center" style={{ fontSize: '4em', lineHeight: '0.1em' }}>
      <Spinner color="secondary" />
    </td>
  </tr>
);

RowSpinner.propTypes = {
  colSpan: PropTypes.number.isRequired,
};

export default RowSpinner;
