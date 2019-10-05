import React from 'react';
import { Router } from '@reach/router';
import Layout from '../../../components/layout';
import List from './list';
import Form from './form';

const Pages = () => (
  <Layout title="Pages">
    <Router>
      <Form path="edit/:id" />
      <List path="/" />
    </Router>
  </Layout>
);

export default Pages;
