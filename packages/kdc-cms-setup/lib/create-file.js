// include node fs module
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../../../");

const createFile = async ctx => {
  const { stage, aws, jwt_secret, user } = ctx;
  const configFile = path.resolve(rootDir, `config.${stage}.yml`);

  if (aws) {
    const { region, profile, domain, cmsBucket, uploadBucket } = aws;

    try {
      fs.truncateSync(configFile);
    } catch (error) {}

    try {
      fs.appendFileSync(configFile, `REGION: ${region}\n`, "utf8");
      fs.appendFileSync(configFile, `PROFILE: ${profile}\n`, "utf8");
      fs.appendFileSync(configFile, `ROOT_DOMAIN: ${domain}\n`, "utf8");
      fs.appendFileSync(configFile, `ADMIN_BUCKET: ${cmsBucket}\n`, "utf8");
      fs.appendFileSync(configFile, `UPLOAD_BUCKET: ${uploadBucket}\n`, "utf8");
    } catch (err) {
      /* Handle the error */
      return Promise.reject(err);
    }
  } else {
    try {
      fs.appendFileSync(configFile, `REGION: localhost\n`, "utf8");
      fs.appendFileSync(configFile, `PROFILE: default\n`, "utf8");
      fs.appendFileSync(configFile, `ROOT_DOMAIN: localhost\n`, "utf8");
      fs.appendFileSync(configFile, `ADMIN_BUCKET: admin-local\n`, "utf8");
      fs.appendFileSync(configFile, `UPLOAD_BUCKET: upload-local\n`, "utf8");
    } catch (err) {
      /* Handle the error */
      return Promise.reject(err);
    }
  }

  if (jwt_secret) {
    try {
      fs.appendFileSync(configFile, `JWT_SECRET: ${jwt_secret}\n`, "utf8");

      // Set this for local
      process.env.JWT_SECRET = jwt_secret;
    } catch (err) {
      /* Handle the error */
      return Promise.reject(err);
    }
  }

  if (user) {
    const { role, name, username, email, password } = user;
    const filename = path.resolve(rootDir, `user.${stage}.yml`);

    try {
      fs.truncateSync(filename);
    } catch (error) {}

    try {
      fs.appendFileSync(filename, `name: ${name}\n`, "utf8");
      fs.appendFileSync(filename, `username: ${username}\n`, "utf8");
      fs.appendFileSync(filename, `email: ${email}\n`, "utf8");
      fs.appendFileSync(
        filename,
        `password: ${Buffer.from(password).toString("base64")}\n`,
        "utf8"
      );
      fs.appendFileSync(filename, `role: ${role}\n`, "utf8");
    } catch (err) {
      /* Handle the error */
      return Promise.reject(err);
    }
  }

  return ctx;
};

module.exports = createFile;
