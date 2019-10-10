/**
 * Use this for testing only
 */

const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-southeast-1',
  endpoint: 'http://localhost:8103/'
});

const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});

const deleteItem = async item => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE || 'kdc-cms-test',
    Key: {
      pk: item.pk,
      sk: item.sk
    }
  };

  await docClient.delete(params).promise();
};

// to delete, query via gsi and delete one by one
// it's since it's test. do not do this in production
const clearDb = async key => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE || 'kdc-cms-test',
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
    })
    .catch(e => console.log(e));
};

module.exports = clearDb;
