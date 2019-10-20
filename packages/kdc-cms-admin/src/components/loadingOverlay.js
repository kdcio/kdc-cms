import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

const LoadingOverlay = ({ isLoading, children }) => (
  <div className="position-relative">
    {isLoading ? (
      <div className="loading-overlay-spinner">
        <Spinner color="secondary" />
      </div>
    ) : null}
    {children}
  </div>
);

LoadingOverlay.propTypes = {
  children: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default LoadingOverlay;
