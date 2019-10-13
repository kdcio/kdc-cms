import React from 'react';
import PropTypes from 'prop-types';

const SideBarToggleContext = React.createContext();

export const useSideBar = () => React.useContext(SideBarToggleContext);

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const SideBarToggleProvider = ({ children }) => {
  const [isViewPortChecked, setIsViewPortChecked] = React.useState(false);
  const [sideBarOpen, setSideBarOpen] = React.useState(true);

  const ToggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  React.useEffect(() => {
    if (!isViewPortChecked) {
      const { width } = getWindowDimensions();
      if (width < 768) {
        setSideBarOpen(false);
      } else {
        setSideBarOpen(true);
      }
      setIsViewPortChecked(true);
    }

    if (!sideBarOpen) {
      document.body.classList.add('sidebar-toggled');
    } else {
      document.body.classList.remove('sidebar-toggled');
    }
  }, [isViewPortChecked, sideBarOpen]);

  return (
    <SideBarToggleContext.Provider value={{ sideBarOpen, ToggleSideBar }}>
      {children}
    </SideBarToggleContext.Provider>
  );
};

SideBarToggleProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
