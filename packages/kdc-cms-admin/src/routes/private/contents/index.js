import React from 'react';
import { Router } from '@reach/router';
import Layout from '../../../components/layout';
import List from './list';
import Form from './form';

const Pages = () => (
  <Layout title="Content">
    <Router>
      <Form path=":typeId/add" />
      <Form path=":typeId/edit/:contentId" />
      <List path=":typeId" />
    </Router>
  </Layout>
);

export default Pages;
