const AWS = require("aws-sdk");

if (process.env.AWS_PROFILE) {
  const credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE
  });
  AWS.config.credentials = credentials;
}

if (process.env.IS_OFFLINE === true || process.env.IS_OFFLINE === "true") {
  AWS.config.update({
    region: "localhost",
    endpoint: "http://localhost:8103"
  });
} else if (process.env.DDB_REGION) {
  AWS.config.update({
    region: process.env.DDB_REGION
  });
}

const client = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.DDB_TABLE || "kdc-cms-database-test";

const DDB = (action, params) => {
  let actualParams = { TableName, ...params };
  if (action === "transactWrite") {
    actualParams = { TransactItems: [] };
    params.TransactItems.forEach(p => {
      Object.keys(p).map(act => {
        const req = {
          [act]: { TableName, ...p[act] }
        };
        actualParams.TransactItems.push(req);
      });
    });
  }
  return client[action](actualParams).promise();
};

module.exports = DDB;
