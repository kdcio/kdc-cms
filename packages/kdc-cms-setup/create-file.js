// include node fs module
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../../");

const createFile = async ({ aws }) => {
  const { stage, region, profile } = aws;
  const filename = path.resolve(rootDir, `setup.${stage}.yml`);

  try {
    // delete file if it exists
    fs.unlinkSync(filename);
  } catch (e) {}

  try {
    fs.appendFileSync(filename, `REGION: ${region}\n`, "utf8");
    fs.appendFileSync(filename, `PROFILE: ${profile}\n`, "utf8");
    console.log('The "data to append" was appended to file!');
  } catch (err) {
    /* Handle the error */
    console.log(err);
  }
};

module.exports = createFile;
