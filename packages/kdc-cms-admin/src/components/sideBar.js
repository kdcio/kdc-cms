import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@reach/router';
import { isDev, isAdmin } from 'kdc-cms-roles';
import { useContentTypeList } from '../context/contentTypeList';
import { useSideBar } from '../context/sideBar';
import { useAuth } from '../context/auth';

const isActive = (props) => {
  const { isCurrent } = props;
  return {
    className: isCurrent ? 'nav-link active' : 'nav-link',
  };
};

const ExactNavLink = (props) => <Link getProps={isActive} {...props} />;

// this link will be active when itself or deeper routes
// are current
const isPartiallyActive = (props) => {
  const { isPartiallyCurrent } = props;
  return {
    className: isPartiallyCurrent ? 'nav-link active' : 'nav-link',
  };
};

const PartialNavLink = (props) => <Link getProps={isPartiallyActive} {...props} />;

const SideBar = () => {
  const { typeList } = useContentTypeList();
  const { sideBarOpen, ToggleSideBar } = useSideBar();
  const { getUser } = useAuth();
  const { role } = getUser();

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
      <li className="nav-item">
        <ExactNavLink className="nav-link" to="/">
          <FontAwesomeIcon icon="tachometer-alt" />
          <span>Dashboard</span>
        </ExactNavLink>
      </li>
      <hr className="sidebar-divider" />
      <div className="sidebar-heading">Content</div>
      <li className="nav-item">
        <PartialNavLink className="nav-link" to="/pages">
          <FontAwesomeIcon icon="file" />
          <span>Pages</span>
        </PartialNavLink>
      </li>
      {typeList.map((t) => (
        <li className="nav-item" key={t.id}>
          <PartialNavLink className="nav-link" to={`/contents/${t.id}`}>
            <FontAwesomeIcon icon="folder" />
            <span>{t.name}</span>
          </PartialNavLink>
        </li>
      ))}
      <hr className="sidebar-divider" />

      {isDev(role) || isAdmin(role) ? (
        <>
          <div className="sidebar-heading">System</div>
          {isDev(role) ? (
            <>
              <li className="nav-item">
                <PartialNavLink className="nav-link" to="/define/types">
                  <FontAwesomeIcon icon="cog" />
                  <span>Define Content</span>
                </PartialNavLink>
              </li>
              <li className="nav-item">
                <PartialNavLink className="nav-link" to="/define/pages">
                  <FontAwesomeIcon icon="wrench" />
                  <span>Define Pages</span>
                </PartialNavLink>
              </li>
              <li className="nav-item">
                <PartialNavLink className="nav-link" to="/apps">
                  <FontAwesomeIcon icon="cogs" />
                  <span>App Access</span>
                </PartialNavLink>
              </li>
            </>
          ) : null}

          <li className="nav-item">
            <PartialNavLink className="nav-link" to="/users">
              <FontAwesomeIcon icon="users" />
              <span>Users</span>
            </PartialNavLink>
          </li>
          <hr className="sidebar-divider d-none d-md-block" />
        </>
      ) : null}

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
