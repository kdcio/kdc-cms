const AWS = require("aws-sdk");
const app = require("../app");

AWS.config.update({
  region: "ap-southeast-1",
  endpoint: "http://localhost:8000/"
});

const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10"
});
const tableName = "kdc-cms";

const deleteItem = async item => {
  const params = {
    TableName: tableName,
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
    TableName: tableName,
    IndexName: "GS1",
    KeyConditionExpression: "gs1pk = :pk",
    ExpressionAttributeValues: {
      ":pk": key
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

module.exports = { app: app.listen(), clearTable };
