// include node fs module
const fs = require("fs");
const path = require("path");
const Users = require("kdc-cms-models/models/users");

const rootDir = path.resolve(__dirname, "../../");

const createFile = async ctx => {
  const { stage, aws, user, jwt_secret } = ctx;

  if (aws) {
    const { region, profile } = aws;
    const filename = path.resolve(rootDir, `config.${stage}.yml`);

    try {
      fs.appendFileSync(filename, `REGION: ${region}\n`, "utf8");
      fs.appendFileSync(filename, `PROFILE: ${profile}\n`, "utf8");
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

  if (user) {
    const { name, email, password, role } = user;
    // create user
    return Users.create({ email, password, name, role })
      .then(() => {
        console.log("User created");
      })
      .catch(e => console.log(e));
  }

  return Promise.resolve(ctx);
};

module.exports = createFile;
