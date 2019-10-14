const questions = require("./questions");
const createFile = require("./create-file");

questions()
  .then(createFile)
  .catch(e => console.log(e));
