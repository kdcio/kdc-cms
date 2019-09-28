const DynamoDB = require("./dynamodb");

class PageDefinition extends DynamoDB {
  post({ name, id, ...attr }) {
    const createdAt = new Date().valueOf();
    const Item = {
      pk: id,
      sk: "page",
      gs1pk: "page",
      gs1sk: name,
      ...attr,
      createdAt
    };

    const params = {
      TableName: this.tableName,
      Item
    };

    return this.docClient
      .put(params)
      .promise()
      .then(async () => Item.pk);
  }

  get({ id }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: id, sk: "page" }
    };

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject({ code: "PageNotFound" });
        }
        return data.Item;
      });
  }

  list() {
    const params = {
      TableName: this.tableName,
      IndexName: "GS1",
      KeyConditionExpression: "gs1pk = :pk",
      ExpressionAttributeValues: {
        ":pk": "page"
      }
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data);
  }
}

module.exports = new PageDefinition();
