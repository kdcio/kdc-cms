import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

const Layout = (props) => (
  <Container className={props.className ? props.className : null}>{props.children}</Container>
);

Layout.propTypes = {
  className: PropTypes.string,
  children: PropTypes.object,
};
export default Layout;
