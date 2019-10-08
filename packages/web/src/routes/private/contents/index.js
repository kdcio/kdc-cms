import React from 'react';
import { Router } from '@reach/router';
import Layout from '../../../components/layout';
import List from './list';
import Form from './form';

const Pages = () => (
  <Layout title="Content">
    <Router>
      <Form path=":id/add" />
      <Form path=":id/edit/:slug" />
      <List path=":id" />
    </Router>
  </Layout>
);

export default Pages;
