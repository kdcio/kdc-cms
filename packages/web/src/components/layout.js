import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import SideBar from './sideBar';
import TopBar from './topBar';
import ScrollTop from './scrollTop';
import Footer from './footer';

const Layout = (props) => (
  <div id="wrapper">
    <SideBar />
    <div id="content-wrapper" className="d-flex flex-column">
      <div id="content">
        <TopBar title={props.title} />
        <Container className={props.className ? props.className : null} fluid>
          {props.children}
        </Container>
      </div>
      <Footer />
    </div>
    <ScrollTop />
  </div>
);

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.array.isRequired,
};

export default Layout;
