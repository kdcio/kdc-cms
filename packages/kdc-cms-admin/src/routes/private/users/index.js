import React from 'react';
import { Router } from '@reach/router';
import Layout from '../../../components/layout';
import List from './list';
import Form from './form';

const Users = () => (
  <Layout title="Users">
    <Router>
      <Form path="add" />
      <Form path="edit/:username" />
      <List path="/" />
    </Router>
  </Layout>
);

export default Users;
