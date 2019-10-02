import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import SideBar from './sideBar';
import TopBar from './topBar';

const Layout = (props) => (
  <div id="wrapper">
    <SideBar />
    <div id="content-wrapper" className="d-flex flex-column">
      <TopBar title={props.title} />
      <Container className={props.className ? props.className : null} fluid>
        {props.children}
      </Container>
    </div>
  </div>
);

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.object.isRequired,
};

export default Layout;
