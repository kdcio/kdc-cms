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
const clearDb = require('../helpers/clearDb');
const app = require('../app');
const Users = require('../models/users');
const schema = require('../schema.json');

const createTable = () => {
  return new Promise(resolve => {
    const dynamodb = new AWS.DynamoDB();
    schema.TableName = process.env.DYNAMODB_TABLE;
    dynamodb.createTable(schema, () => {
      resolve();
    });
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
  await clearDb('user');
  await createUser(user);
  const { token } = await loginUser();
  user.token = token;
  return user;
};

module.exports = { app: app.listen(), clearDb, admin: initUser() };
