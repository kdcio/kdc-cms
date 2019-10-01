const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const DynamoDB = require("./dynamodb");

class Users extends DynamoDB {
  async authenticate({ email, password }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: email, sk: "user#pw" }
    };

    const data = await this.docClient.get(params).promise();
    if (!data.Item) return;

    const { Item: user } = data;
    if (this.validPassword(password, user.salt, user.hash)) {
      const token = jwt.sign({ sub: user.pk }, process.env.JWT_SECRET);
      return { email, token };
    }
  }

  setPassword(password) {
    // Creating a unique salt for a particular user
    const salt = crypto.randomBytes(16).toString("hex");

    // Hashing user's salt and password with 1000 iterations,
    // 64 length and sha512 digest
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return { hash, salt };
  }

  validPassword(inputPassword, salt, hash) {
    const inputHash = crypto
      .pbkdf2Sync(inputPassword, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return inputHash === hash;
  }

  async create({ email, name, password, ...attr }) {
    const createdAt = new Date().valueOf();
    const Item = {
      pk: email,
      sk: "user",
      gs1pk: "user",
      gs1sk: name,
      ...attr,
      createdAt
    };

    const params = {
      TableName: this.tableName,
      Item
    };

    return this.docClient
      .put(params)
      .promise()
      .then(() => this.createPassword({ email, password }));
  }

  async createPassword({ email, password }) {
    const createdAt = new Date().valueOf();
    const { hash, salt } = this.setPassword(password);
    const Item = {
      pk: email,
      sk: "user#pw",
      hash,
      salt,
      createdAt
    };

    const params = {
      TableName: this.tableName,
      Item
    };

    return this.docClient
      .put(params)
      .promise()
      .then(async () => Item.pk);
  }

  get({ email }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: email, sk: "user" }
    };

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject({ code: "UserNotFound" });
        }
        return data.Item;
      });
  }

  list() {
    return ["Melchor", "Gaspar", "Baltazar"];
  }
}

module.exports = new Users();
