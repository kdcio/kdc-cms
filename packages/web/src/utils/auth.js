import api from "./api";

const localStorageKey = "__kdc_cms_token__";

const handleUserResponse = user => {
  const { token } = user;
  window.localStorage.setItem(localStorageKey, token);
  return user;
};

const getUser = () => {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  return api("users/me").catch(error => {
    logout();
    return Promise.reject(error);
  });
};

const login = ({ email, password }) => {
  return api("users/authenticate", { body: { email, password } }).then(
    handleUserResponse
  );
};

const register = ({ email, password }) => {
  return api("register", { body: { email, password } }).then(
    handleUserResponse
  );
};

function logout() {
  window.localStorage.removeItem(localStorageKey);
  return Promise.resolve();
}

function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

export { login, register, logout, getToken, getUser };
