/**
 * Initialize environment variables on dev
 * In production, define these variables in lambda function.
 * Do not save it in any file.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = '0987654321';
process.env.DYNAMODB_TABLE = 'kdc-cms-test';

const AWS = require('aws-sdk');
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const app = require('../app');
const Users = require('../models/users');
const schema = require('../schema.json');

AWS.config.update({
  region: 'ap-southeast-1',
  endpoint: 'http://localhost:8103/'
});

const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});

const createTable = () => {
  return new Promise(resolve => {
    const dynamodb = new AWS.DynamoDB();
    schema.TableName = process.env.DYNAMODB_TABLE;
    dynamodb.createTable(schema, () => {
      resolve();
    });
  });
};

const deleteItem = async item => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      pk: item.pk,
      sk: item.sk
    }
  };

  await docClient.delete(params).promise();
};

// to delete, query via gsi and delete one by one
// it's since it's test. do not do this in production
const clearTable = async key => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'GS1',
    KeyConditionExpression: 'gs1pk = :pk',
    ExpressionAttributeValues: {
      ':pk': key
    }
  };

  return docClient
    .query(params)
    .promise()
    .then(data => {
      const promises = [];
      data.Items.forEach(item => {
        promises.push(deleteItem(item));
      });

      return Promise.all(promises);
    });
};

const user = {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
  role: 'admin'
};

const createUser = async () => {
  await Users.create(user);
};

const loginUser = async () => {
  const token = await Users.authenticate(user);
  return token;
};

const initUser = async () => {
  await createTable();
  await clearTable('user');
  await createUser(user);
  const { token } = await loginUser();
  user.token = token;
  return user;
};

module.exports = { app: app.listen(), clearTable, admin: initUser() };
