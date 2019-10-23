const roles = require("./lib/roles");
const policies = require("./lib/policies");

module.exports = { ...roles, ...policies };
