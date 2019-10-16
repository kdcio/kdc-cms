const DynamoDB = require("./dynamodb");
const remap = require("../utils/remap");

class ContentDefinition extends DynamoDB {
  constructor() {
    super();
    this.fieldMap = {
      pk: "id",
      gs1sk: "name"
    };
  }

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
      Item,
      ConditionExpression: "attribute_not_exists(pk)"
    };

    return this.docClient
      .put(params)
      .promise()
      .then(async () => Item.pk);
  }

  get({ id }, opts = {}) {
    const params = {
      TableName: this.tableName,
      Key: { pk: id, sk: "content" }
    };
    const { raw } = opts;

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (raw) return data.Item;
        return remap(data.Item, this.fieldMap);
      });
  }

  list() {
    const params = {
      TableName: this.tableName,
      IndexName: "GS1",
      KeyConditionExpression: "gs1pk = :pk",
      ExpressionAttributeValues: {
        ":pk": "content"
      },
      ExpressionAttributeNames: {
        "#fields": "fields"
      },
      ProjectionExpression:
        "pk, gs1sk, description, fieldCount, #fields, createdAt, updatedAt"
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data.Items.map(i => remap(i, this.fieldMap)));
  }

  async put({ id, attr }) {
    const content = await this.get({ id }, { raw: true });
    const { name, ...otherAttr } = attr;

    const updatedAt = new Date().valueOf();
    const Item = {
      ...content,
      ...otherAttr,
      gs1sk: name || content.gs1sk,
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

module.exports = ContentDefinition;
