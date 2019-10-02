import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSideBar } from '../context/sideBar';

const TopBar = (props) => {
  const { ToggleSideBar } = useSideBar();

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
        onClick={(e) => {
          e.preventDefault();
          ToggleSideBar();
        }}
      >
        <FontAwesomeIcon icon="bars" />
      </button>
      <h3 className="mr-auto ml-md-3 my-2 my-md-0 mw-100">{props.title}</h3>
      <ul className="navbar-nav ml-auto">
        <div className="topbar-divider d-none d-sm-block"></div>
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" href="/dropdown" id="userDropdown" role="button">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">Ian dela Cruz</span>
          </a>
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in">
            <a className="dropdown-item" href="/logout">
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

TopBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TopBar;
