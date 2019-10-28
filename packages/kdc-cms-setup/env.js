const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const rootDir = path.resolve(__dirname, "../../");

const args = process.argv.slice(2);
let stage = "local";

if (args[0]) {
  stage = args[0];
}

const configFile = path.resolve(rootDir, `config.${stage}.yml`);
const userFile = path.resolve(rootDir, `user.${stage}.yml`);

// Get document, or throw exception on error
try {
  const config = yaml.safeLoad(fs.readFileSync(configFile, "utf8"));
  process.env.DDB_REGION = process.env.DDB_REGION || config.REGION;
  process.env.JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET;
  if (stage !== "local") {
    process.env.AWS_PROFILE = process.env.AWS_PROFILE || config.PROFILE;
    process.env.IS_OFFLINE = false;
    process.env.DDB_TABLE = `database-${stage}.${config.ROOT_DOMAIN}`;
  } else {
    process.env.IS_OFFLINE = true;
    process.env.DDB_TABLE = "database-local.localhost";
  }

  const user = yaml.safeLoad(fs.readFileSync(userFile, "utf8"));
  process.env.KDC_CMS = JSON.stringify({ ...user });
} catch (e) {
  console.log(e);
}

// cleanup on exit
process.on("exit", function() {
  delete process.env.KDC_CMS;
  fs.unlinkSync(userFile);
});
