import React from 'react';
import { Router } from '@reach/router';
import Layout from '../../../components/layout';
import TypesList from './typesList';
import TypesForm from './typesForm';

const Types = () => (
  <Layout title="Define Content Types">
    <Router>
      <TypesForm path="add" />
      <TypesForm path="edit/:id" />
      <TypesList path="/" />
    </Router>
  </Layout>
);

export default Types;
