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
  process.env.DDB_REGION = process.env.DDB_REGION || config.REGION;
  process.env.JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET;
  process.env.DDB_TABLE = `kdc-cms-database-${stage}`;
  if (stage !== "local") {
    process.env.AWS_PROFILE = process.env.AWS_PROFILE || config.PROFILE;
  }
} catch (e) {
  console.log(e);
}
