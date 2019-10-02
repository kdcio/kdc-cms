import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './context/user';
import { SideBarToggleProvider } from './context/sideBar';
import FullPageSpinner from './components/fullPageSpinner';

const loadPrivateApp = () => import('./routes/private');
const PrivateApp = React.lazy(loadPrivateApp);
const PublicApp = React.lazy(() => import('./routes/public'));

library.add(faAngleLeft, faAngleRight, faBars);

function App() {
  const user = useUser();
  React.useEffect(() => {
    loadPrivateApp();
  }, []);
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? (
        <SideBarToggleProvider>
          <PrivateApp />
        </SideBarToggleProvider>
      ) : (
        <PublicApp />
      )}
    </React.Suspense>
  );
}

export default App;
