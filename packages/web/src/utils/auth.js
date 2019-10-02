import api from './api';

const localStorageKey = '__kdc_cms_token__';

const handleUserResponse = (user) => {
  const { token } = user;
  localStorage.setItem(localStorageKey, token);
  return user;
};

const login = ({ email, password }) => {
  api('users/authenticate', { body: { email, password } }).then(handleUserResponse);
};

const register = ({ email, password }) => {
  api('register', { body: { email, password } }).then(handleUserResponse);
};

const logout = () => {
  localStorage.removeItem(localStorageKey);
  return Promise.resolve();
};

const getToken = () => localStorage.getItem(localStorageKey);

const getUser = () => {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  return api('users/me').catch((error) => {
    logout();
    return Promise.reject(error);
  });
};

export { login, register, logout, getToken, getUser };
