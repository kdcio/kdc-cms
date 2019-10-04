import React from 'react';
import { Router } from '@reach/router';
import Login from './login';
import Error404 from './404';

const Public = () => (
  <Router>
    <Login path="/" />
    <Error404 default />
  </Router>
);

export default Public;
