require("./env");
const questions = require("./lib/questions-user");
const createFile = require("./lib/create-file");
const createUser = require("./lib/create-user");

questions()
  .then(ctx => createFile(ctx))
  .then(ctx => createUser(ctx))
  .catch(e => console.log(e));
