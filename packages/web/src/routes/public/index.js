import React from 'react';
import { Router } from '@reach/router';
import Login from './login';
import Error404 from './404';

const Public = () => (
  <Router>
    <Login path="/" />
    <Error404 path="error" />
  </Router>
);

export default Public;
