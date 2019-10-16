import AWS from 'aws-sdk';

if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8103'
  });
}

const client = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.DYNAMODB_TABLE || 'kdc-cms-database-local';

const ddb = (action, params) => {
  return client[action]({ TableName, ...params }).promise();
};

export default ddb;
