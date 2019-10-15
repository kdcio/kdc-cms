const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const rootDir = path.resolve(__dirname, "../../");

const args = process.argv.slice(2);
let stage = "local";

if (args[0]) {
  stage = args[0];
}

// Get document, or throw exception on error
try {
  const filename = path.resolve(rootDir, `config.${stage}.yml`);
  const config = yaml.safeLoad(fs.readFileSync(filename, "utf8"));
  process.env.AWS_REGION = process.env.AWS_REGION || config.REGION;
  process.env.JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET;
  process.env.DYNAMODB_TABLE = `kdc-cms-database-${stage}`;
  if (stage === "local") {
    process.env.DYNAMODB_ENDPOINT = "http://localhost:8103/";
  } else {
    process.env.AWS_PROFILE = process.env.AWS_PROFILE || config.PROFILE;
    process.env.DYNAMODB_ENDPOINT = `https://dynamodb.${process.env.AWS_REGION}.amazonaws.com`;
  }
} catch (e) {
  console.log(e);
}
