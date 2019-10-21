import React, { Suspense } from 'react';
import { Router } from '@reach/router';
import FullPageSpinner from '../../components/fullPageSpinner';

const Dashboard = React.lazy(() => import('./dashboard'));
const DefinePages = React.lazy(() => import('./define/pages'));
const DefineTypes = React.lazy(() => import('./define/types'));
const Pages = React.lazy(() => import('./pages'));
const Contents = React.lazy(() => import('./contents'));
const Users = React.lazy(() => import('./users'));
const Error404 = React.lazy(() => import('./404'));

const Public = () => (
  <Suspense fallback={<FullPageSpinner />}>
    <Router>
      <Dashboard path="/" />
      <DefinePages path="/define/pages/*" />
      <DefineTypes path="/define/types/*" />
      <Pages path="/pages/*" />
      <Contents path="/contents/*" />
      <Users path="/users/*" />
      <Error404 default />
    </Router>
  </Suspense>
);

export default Public;
