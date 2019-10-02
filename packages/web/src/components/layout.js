import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import SideBar from './sideBar';
import TopBar from './topBar';

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
      <footer className="sticky-footer bg-white">
        <div className="container my-auto">
          <div className="copyright text-center my-auto">
            <span>
              Powered by{' '}
              <a
                className="small"
                href="https://github.com/ianpogi5/kdc-cms"
                target="_blank"
                rel="noopener noreferrer"
              >
                KDC CMS
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  </div>
);

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.object.isRequired,
};

export default Layout;
