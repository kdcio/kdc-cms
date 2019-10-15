require("./env");
const questions = require("./questions-user");
const createFile = require("./create-file");

questions()
  .then(createFile)
  .catch(e => console.log(e));
