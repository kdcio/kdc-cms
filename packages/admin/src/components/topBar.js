import React from 'react';
import PropTypes from 'prop-types';
import { Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { navigate } from '@reach/router';
import { useSideBar } from '../context/sideBar';
import { useAuth } from '../context/auth';

const TopBar = (props) => {
  const { ToggleSideBar } = useSideBar();
  const { getUser, logout } = useAuth();
  const { name } = getUser();

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
      <h3 id="topBarTitle" className="mr-auto ml-md-3 my-2 my-md-0 mw-100">
        {props.title}
      </h3>
      <Nav className="ml-auto" navbar>
        <div className="topbar-divider d-none d-sm-block"></div>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{name}</span>
            <FontAwesomeIcon icon="user" />
          </DropdownToggle>
          <DropdownMenu right className="shadow animated--grow-in">
            <DropdownItem
              onClick={(e) => {
                e.preventDefault();
                logout();
                navigate('/');
              }}
            >
              <FontAwesomeIcon icon="sign-out-alt" className="fa-sm fa-fw mr-2 text-gray-400" />
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </nav>
  );
};

TopBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TopBar;
