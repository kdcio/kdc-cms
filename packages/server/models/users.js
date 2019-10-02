/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const { isValidPassword, encryptPassword } = require('../helpers/encrypt');
const DynamoDB = require('./dynamodb');

class Users extends DynamoDB {
  async authenticate({ email, password }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: email, sk: 'user' },
      AttributesToGet: ['pk', 'gs1sk', 'role', 'hash', 'salt']
    };

    const data = await this.docClient.get(params).promise();
    if (!data.Item) return null;

    const { Item: user } = data;
    if (isValidPassword(password, user.salt, user.hash)) {
      const token = jwt.sign({ sub: user.pk }, process.env.JWT_SECRET);
      return { email, token, name: user.gs1sk, role: user.role };
    }
    return null;
  }

  async create({ email, name, password, ...attr }) {
    const createdAt = new Date().valueOf();
    const { hash, salt } = encryptPassword(password);
    const Item = {
      pk: email,
      sk: 'user',
      gs1pk: 'user',
      gs1sk: name,
      ...attr,
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
      Key: { pk: email, sk: 'user' }
    };

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject(new Error({ code: 'UserNotFound' }));
        }
        return data.Item;
      });
  }

  list() {
    const params = {
      TableName: this.tableName,
      IndexName: 'GS1',
      KeyConditionExpression: 'gs1pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'user'
      }
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data);
  }

  async put({ email, attr }) {
    const user = await this.get({ email });

    const updatedAt = new Date().valueOf();
    const Item = {
      ...user,
      ...attr,
      updatedAt
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

  async delete({ email }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: email, sk: 'page' }
    };

    return this.docClient.delete(params).promise();
  }

  async changePassword({ email, newPassword, oldPassword }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: email, sk: 'user' }
    };

    const data = await this.docClient.get(params).promise();
    if (!data.Item) return Promise.reject(new Error({ code: 'UserNotFound' }));

    const { Item: user } = data;
    if (isValidPassword(oldPassword, user.salt, user.hash)) {
      const { hash, salt } = encryptPassword(newPassword);
      return this.put({ email, hash, salt });
    }

    return Promise.reject(new Error({ code: 'PasswordInvalid' }));
  }
}

module.exports = new Users();
