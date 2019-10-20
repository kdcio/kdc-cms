import React from 'react';
import './fa'; // fontawesome
import { useAuth } from './context/auth';
import { SideBarToggleProvider } from './context/sideBar';
import { ContentTypeListProvider } from './context/contentTypeList';
import FullPageSpinner from './components/fullPageSpinner';

const loadPrivateApp = () => import('./routes/private');
const PrivateApp = React.lazy(loadPrivateApp);
const PublicApp = React.lazy(() => import('./routes/public'));

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
