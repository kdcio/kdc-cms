import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import { useSideBar } from '../context/sideBar';

const SideBar = () => {
  const { sideBarOpen, ToggleSideBar } = useSideBar();
  let sbClass = 'navbar-nav bg-gradient-primary sidebar sidebar-dark accordion';
  if (!sideBarOpen) {
    sbClass += ' toggled';
  }

  return (
    <ul className={sbClass} id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
        <div className="sidebar-brand-icon rotate-n-15">
          <FontAwesomeIcon icon="keyboard" />
        </div>
        <div className="sidebar-brand-text mx-3">KDC CMS</div>
      </Link>
      <hr className="sidebar-divider my-0" />
      <li className="nav-item active">
        <Link className="nav-link" to="/">
          <FontAwesomeIcon icon="tachometer-alt" />
          <span>Dashboard</span>
        </Link>
      </li>
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">Content</div>
      <li className="nav-item">
        <Link className="nav-link" to="/pages">
          <FontAwesomeIcon icon="file" />
          <span>Pages</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/contents/blogs">
          <FontAwesomeIcon icon="folder" />
          <span>Blogs</span>
        </Link>
      </li>
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">Define</div>
      <li className="nav-item">
        <Link className="nav-link" to="/define/pages">
          <FontAwesomeIcon icon="wrench" />
          <span>Pages</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/define/types">
          <FontAwesomeIcon icon="cog" />
          <span>Content</span>
        </Link>
      </li>
      <hr className="sidebar-divider d-none d-md-block" />

      <div className="text-center d-none d-md-inline">
        <button
          className="rounded-circle border-0"
          id="sidebarToggle"
          onClick={(e) => {
            e.preventDefault();
            ToggleSideBar();
          }}
        >
          {sideBarOpen ? (
            <FontAwesomeIcon icon="angle-left" />
          ) : (
            <FontAwesomeIcon icon="angle-right" />
          )}
        </button>
      </div>
    </ul>
  );
};

export default SideBar;
