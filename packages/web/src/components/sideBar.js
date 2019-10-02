import React from "react";

export default props => (
  <ul
    className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
    id="accordionSidebar"
  >
    <a
      className="sidebar-brand d-flex align-items-center justify-content-center"
      href="/"
    >
      <div className="sidebar-brand-text mx-3">KDC CMS</div>
    </a>
    <hr className="sidebar-divider my-0" />
    <li className="nav-item active">
      <a className="nav-link" href="index.html">
        <i className="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </a>
    </li>
    <hr className="sidebar-divider" />
    <div className="sidebar-heading">Content</div>
    <li className="nav-item">
      <a className="nav-link" href="charts.html">
        <i className="fas fa-fw fa-chart-area"></i>
        <span>Pages</span>
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="charts.html">
        <i className="fas fa-fw fa-chart-area"></i>
        <span>Blogs</span>
      </a>
    </li>
    <hr className="sidebar-divider" />
    <div className="sidebar-heading">Define Content Types</div>
    <li className="nav-item">
      <a className="nav-link" href="charts.html">
        <i className="fas fa-fw fa-chart-area"></i>
        <span>Pages</span>
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="charts.html">
        <i className="fas fa-fw fa-chart-area"></i>
        <span>Content</span>
      </a>
    </li>
    <hr className="sidebar-divider d-none d-md-block" />
    {/* 
    <div className="text-center d-none d-md-inline">
      <button className="rounded-circle border-0" id="sidebarToggle"></button>
    </div> */}
  </ul>
);
