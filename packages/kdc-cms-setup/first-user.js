require("./env");
const questions = require("./lib/questions-user");
const createUser = require("./lib/create-user");

questions()
  .then(ctx => createUser(ctx))
  .catch(e => console.log(e));
