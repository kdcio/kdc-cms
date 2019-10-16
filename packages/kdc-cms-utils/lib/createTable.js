const AWS = require("aws-sdk");

const createTable = schema => {
  return new Promise(resolve => {
    const dynamodb = new AWS.DynamoDB();
    schema.TableName = process.env.DDB_TABLE;
    dynamodb.createTable(schema, () => {
      resolve();
    });
  });
};

module.exports = createTable;
