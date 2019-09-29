const DynamoDB = require("./dynamodb");
const ContentDefinition = require("./contentDefinition");

class Contents extends DynamoDB {
  async post({ slug, type, ...attr }) {
    const definition = await ContentDefinition.get({ type });
    const createdAt = new Date().valueOf();
    const gs1sk = attr[definition["sort-key"]];
    delete attr[definition["sort-key"]];

    const Item = {
      pk: slug,
      sk: "content#" + type,
      gs1pk: "content#" + type,
      gs1sk,
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

  get({ type, slug }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: slug, sk: "content#" + type }
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

  list(type) {
    const params = {
      TableName: this.tableName,
      IndexName: "GS1",
      KeyConditionExpression: "gs1pk = :pk",
      ExpressionAttributeValues: {
        ":pk": "content#" + type
      }
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data);
  }

  async put({ type, slug, attr }) {
    const content = await this.get({ type, slug });

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

  async delete({ type, slug }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: slug, sk: "content#" + type }
    };

    return this.docClient.delete(params).promise();
  }
}

module.exports = new Contents();
