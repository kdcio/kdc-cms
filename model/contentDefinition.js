const DynamoDB = require("./dynamodb");

class ContentDefinition extends DynamoDB {
  post({ name, id, ...attr }) {
    const createdAt = new Date().valueOf();
    const Item = {
      pk: id,
      sk: "content",
      gs1pk: "content",
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
      Key: { pk: id, sk: "content" }
    };

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject({ code: "ContentNotFound" });
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
        ":pk": "content"
      }
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data);
  }

  async put({ id, attr }) {
    const content = await this.get({ id });

    const updatedAt = new Date().valueOf();
    const Item = {
      ...content,
      ...attr,
      updatedAt
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

  async delete({ id }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: id, sk: "content" }
    };

    return this.docClient.delete(params).promise();
  }
}

module.exports = new ContentDefinition();
