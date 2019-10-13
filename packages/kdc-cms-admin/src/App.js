import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faBars,
  faKeyboard,
  faTachometerAlt,
  faFile,
  faFolder,
  faCog,
  faWrench,
  faUser,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './context/auth';
import { SideBarToggleProvider } from './context/sideBar';
import { ContentTypeListProvider } from './context/contentTypeList';
import FullPageSpinner from './components/fullPageSpinner';

const loadPrivateApp = () => import('./routes/private');
const PrivateApp = React.lazy(loadPrivateApp);
const PublicApp = React.lazy(() => import('./routes/public'));

library.add(
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faBars,
  faKeyboard,
  faTachometerAlt,
  faFile,
  faFolder,
  faCog,
  faWrench,
  faUser,
  faSignOutAlt
);

function App() {
  const { user } = useAuth();
  React.useEffect(() => {
    loadPrivateApp();
  }, []);
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? (
        <ContentTypeListProvider>
          <SideBarToggleProvider>
            <PrivateApp />
          </SideBarToggleProvider>
        </ContentTypeListProvider>
      ) : (
        <PublicApp />
      )}
    </React.Suspense>
  );
}

export default App;
