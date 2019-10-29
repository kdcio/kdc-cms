import React from 'react';
import { useAsync } from 'react-async';
import api from '../utils/api';
import FullPageSpinner from '../components/fullPageSpinner';

const TOKEN_KEY = '__kdc_cms_token__';
const USER_KEY = '__kdc_cms_user__';

const AuthContext = React.createContext();

const useAuth = () => React.useContext(AuthContext);

const initUser = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return Promise.resolve(null);
  return api('users/me');
};

const AuthProvider = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const { data, isLoading } = useAsync({ promiseFn: initUser });

  const login = async ({ username, password }) => {
    let resp = {};
    try {
      resp = await api('login', { body: { username, password } });
    } catch (e) {
      return Promise.reject(e);
    }

    const { token, ...userData } = resp;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      const userText = JSON.stringify(userData);
      localStorage.setItem(USER_KEY, userText);
      setUser(userText);
      return Promise.resolve();
    }

    return Promise.reject(resp);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    return Promise.resolve();
  };

  const getToken = () => localStorage.getItem(TOKEN_KEY);
  const getUser = () => {
    const userText = localStorage.getItem(USER_KEY);
    return JSON.parse(userText);
  };

  React.useLayoutEffect(() => {
    if (!isLoading) {
      setLoading(false);
      if (data && data.user) {
        setUser(getUser());
      }
    }
  }, [isLoading, data]);

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        getToken,
        getUser,
      }}
      {...props}
    />
  );
};

export { AuthProvider, useAuth };
