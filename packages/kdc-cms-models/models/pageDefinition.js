const DynamoDB = require("./dynamodb");
const remap = require("../utils/remap");

class PageDefinition extends DynamoDB {
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
      sk: "page",
      gs1pk: "page",
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
      Key: { pk: id, sk: "page" }
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
        ":pk": "page"
      },
      ProjectionExpression:
        "pk, gs1sk, description, fieldCount, createdAt, updatedAt"
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data.Items.map(i => remap(i, this.fieldMap)));
  }

  /**
   * TODO: if fields are updated, corresponding page#data should also be updated.
   */
  async put({ id, attr }) {
    const page = await this.get({ id }, { raw: true });
    const { name, ...otherAttr } = attr;

    const updatedAt = new Date().valueOf();
    const Item = {
      ...page,
      ...otherAttr,
      gs1sk: name || page.gs1sk,
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
      Key: { pk: id, sk: "page" }
    };

    return this.docClient.delete(params).promise();
  }
}

module.exports = new PageDefinition();
