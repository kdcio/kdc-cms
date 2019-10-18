const AWS = require("aws-sdk");

if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: "localhost",
    endpoint: "http://localhost:8103"
  });
}

const client = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.DDB_TABLE || "kdc-cms-database-local";

const DDB = (action, params) => {
  return client[action]({ TableName, ...params }).promise();
};

const deleteItem = async item => {
  const params = {
    Key: {
      pk: item.pk,
      sk: item.sk
    }
  };

  await DDB("delete", params);
};

// to delete, query via gsi and delete one by one
// it's since it's test. do not do this in production
const clearByGSI = async key => {
  const params = {
    IndexName: "GS1",
    KeyConditionExpression: "gs1pk = :pk",
    ExpressionAttributeValues: {
      ":pk": key
    }
  };

  return DDB("query", params).then(data => {
    const promises = [];
    data.Items.forEach(item => {
      promises.push(deleteItem(item));
    });

    return Promise.all(promises);
  });
};

module.exports = { DDB, clearByGSI };
