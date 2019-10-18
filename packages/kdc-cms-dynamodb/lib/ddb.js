const AWS = require("aws-sdk");

if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: "localhost",
    endpoint: "http://localhost:8103"
  });
}

const client = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.DDB_TABLE || "kdc-cms-database-test";

const DDB = (action, params) => {
  return client[action]({ TableName, ...params }).promise();
};

module.exports = DDB;
