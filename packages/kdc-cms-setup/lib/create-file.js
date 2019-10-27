// include node fs module
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../../../");

const createFile = async ctx => {
  const { stage, aws, jwt_secret } = ctx;

  if (aws) {
    const { region, profile, domain, cmsBucket, uploadBucket } = aws;
    const filename = path.resolve(rootDir, `config.${stage}.yml`);

    try {
      fs.truncateSync(filename);
      fs.appendFileSync(filename, `REGION: ${region}\n`, "utf8");
      fs.appendFileSync(filename, `PROFILE: ${profile}\n`, "utf8");
      fs.appendFileSync(filename, `ROOT_DOMAIN: ${domain}\n`, "utf8");
      fs.appendFileSync(filename, `ADMIN_BUCKET: ${cmsBucket}\n`, "utf8");
      fs.appendFileSync(filename, `UPLOAD_BUCKET: ${uploadBucket}\n`, "utf8");
    } catch (err) {
      /* Handle the error */
      return Promise.reject(err);
    }
  }

  if (jwt_secret) {
    try {
      let filename = "";
      if (!aws) {
        filename = path.resolve(rootDir, `config.local.yml`);
      } else {
        filename = path.resolve(rootDir, `config.${stage}.yml`);
      }

      fs.appendFileSync(filename, `JWT_SECRET: ${jwt_secret}\n`, "utf8");

      // Set this for local
      process.env.JWT_SECRET = jwt_secret;
    } catch (err) {
      /* Handle the error */
      return Promise.reject(err);
    }
  }

  return ctx;
};

module.exports = createFile;
