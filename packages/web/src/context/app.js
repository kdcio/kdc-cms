import React from 'react';
import PropTypes from 'prop-types';
import { AuthProvider } from './auth';
import { UserProvider } from './user';

const AppProviders = ({ children }) => (
  <AuthProvider>
    <UserProvider>{children}</UserProvider>
  </AuthProvider>
);

AppProviders.propTypes = {
  children: PropTypes.object,
};

export default AppProviders;
