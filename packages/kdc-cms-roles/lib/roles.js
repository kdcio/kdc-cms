const ROLE_DEV = "dev";
const ROLE_ADMIN = "admin";
const ROLE_APP = "application";

const roles = [ROLE_DEV, ROLE_ADMIN, ROLE_APP];

const isAdmin = role => role === ROLE_ADMIN;
const isDev = role => role === ROLE_DEV;
const isApp = role => role === ROLE_APP;

module.exports = {
  roles,
  ROLE_DEV,
  ROLE_ADMIN,
  ROLE_APP,
  isAdmin,
  isDev,
  isApp
};
