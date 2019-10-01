import React from "react";
import { useUser } from "./context/user";
import FullPageSpinner from "./components/fullPageSpinner";

const loadPrivateApp = () => import("./routes/private");
const PrivateApp = React.lazy(loadPrivateApp);
const PublicApp = React.lazy(() => import("./routes/public"));

function App() {
  const user = useUser();
  React.useEffect(() => {
    loadPrivateApp();
  }, []);
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <PrivateApp /> : <PublicApp />}
    </React.Suspense>
  );
}

export default App;
