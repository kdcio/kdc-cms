import React from 'react';
import { Router } from '@reach/router';
import Dashboard from './dashboard';
import Error404 from './404';

const Public = () => (
  <Router>
    <Dashboard path="/" />
    <Error404 path="error" />
  </Router>
);

export default Public;
