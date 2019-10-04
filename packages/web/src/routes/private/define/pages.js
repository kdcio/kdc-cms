import React from 'react';
import { Router } from '@reach/router';
import Layout from '../../../components/layout';
import PagesList from './pagesList';
import PagesForm from './pagesForm';

const Pages = () => (
  <Layout title="Define Pages">
    <Router>
      <PagesForm path="add" />
      <PagesList path="/" />
    </Router>
  </Layout>
);

export default Pages;
