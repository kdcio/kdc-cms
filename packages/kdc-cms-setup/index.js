const crypto = require("crypto");
const questionsAWS = require("./questions-aws");
const createFile = require("./create-file");

const args = process.argv.slice(2);
const [stage] = args;

if (!stage) {
  console.log("Missing stage");
  process.exit(1);
}

const jwt_secret = crypto.randomBytes(20).toString("hex");
questionsAWS({ stage, jwt_secret })
  .then(createFile)
  .catch(e => console.log(e));
