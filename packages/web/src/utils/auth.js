import api from './api';

const TOKEN_KEY = '__kdc_cms_token__';
const USER_KEY = '__kdc_cms_user__';

const handleUserResponse = (data) => {
  const { token, ...user } = data;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, user);
  }
  return data;
};

const login = ({ email, password }) => {
  const body = { email, password };
  return api('users/authenticate', { body }).then(handleUserResponse);
};

const register = ({ email, password }) => {
  const body = { email, password };
  return api('register', { body }).then(handleUserResponse);
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return Promise.resolve();
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const getUser = () => {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  return api('users/me')
    .then(() => localStorage.getItem(USER_KEY))
    .catch((error) => {
      logout();
      return Promise.reject(error);
    });
};

export { login, register, logout, getToken, getUser };
