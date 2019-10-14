/**
 * Initialize environment variables on dev
 * In production, define these variables in lambda function.
 * Do not save it in any file.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = '0987654321';
process.env.DYNAMODB_TABLE = 'kdc-cms-test';

const { createTable } = require('kdc-cms-utils');
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const { clearDb } = require('kdc-cms-utils');
const Users = require('kdc-cms-models/models/users');
const app = require('../app');
const schema = require('../schema.json');

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
  await createTable(schema);
  await clearDb('user');
  await createUser(user);
  const { token } = await loginUser();
  user.token = token;
  return user;
};

module.exports = { app: app.listen(), clearDb, admin: initUser() };
