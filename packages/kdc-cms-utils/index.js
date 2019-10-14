const clearDb = require("./lib/clearDb");
const createTable = require("./lib/createTable");
const encrypt = require("./lib/encrypt");
const validateEmail = require("./lib/validateEmail");
const validatePassword = require("./lib/validatePassword");

module.exports = {
  clearDb,
  createTable,
  encrypt,
  validateEmail,
  validatePassword
};
