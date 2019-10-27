const crypto = require("crypto");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const questionsAWS = require("./lib/questions-aws");
const questionsUser = require("./lib/questions-user");
const createFile = require("./lib/create-file");

clear();

console.log(
  chalk.yellow(figlet.textSync("KDC CMS", { horizontalLayout: "full" }))
);

const args = process.argv.slice(2);
const [stage] = args;

if (!stage) {
  console.log("Missing stage");
  process.exit(1);
}

const jwt_secret = crypto.randomBytes(20).toString("hex");
questionsAWS({ stage, jwt_secret })
  .then(questionsUser)
  .then(createFile)
  .catch(e => console.log(e));
