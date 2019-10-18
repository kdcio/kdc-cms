const DDB = require("./ddb");

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

module.exports = clearByGSI;
