const fs = require("fs");
const os = require("os");

let profiles = [];
try {
  const file = fs.readFileSync(os.homedir() + "/.aws/credentials", "utf8");
  profiles = file
    .match(/\[([a-zA-Z0-9])*\]/gm)
    .map(v => v.replace(/\[|\]/g, ""));
} catch (error) {
  console.log("Missing AWS Credentials file");
  process.exit(1);
}

module.exports = profiles;
