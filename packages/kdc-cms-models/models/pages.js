const DynamoDB = require("./dynamodb");
const remap = require("../utils/remap");
const PageDefinition = require("./pageDefinition");

class Pages extends DynamoDB {
  constructor() {
    super();
    this.fieldMap = {
      pk: "id",
      gs1sk: "name"
    };
  }

  async post({ id, ...attr }) {
    const definition = await PageDefinition.get({ id });
    const validAttr = {};
    definition.fields.forEach(f => {
      if (attr[f.name]) {
        validAttr[f.name] = attr[f.name];
      }
    });

    const createdAt = new Date().valueOf();
    const Item = {
      pk: id,
      sk: "page#data",
      gs1pk: "page#data",
      gs1sk: definition.name,
      fields: definition.fields,
      ...validAttr,
      createdAt,
      ConditionExpression: "attribute_not_exists(pk)"
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

  get({ id }, opts = {}) {
    const params = {
      TableName: this.tableName,
      Key: { pk: id, sk: "page#data" }
    };
    const { raw } = opts;

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject(
            new Error({ code: "PageNotFound", message: "Page not found" })
          );
        }

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
        ":pk": "page#data"
      },
      ProjectionExpression: "pk, gs1sk, createdAt, updatedAt"
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data.Items.map(i => remap(i, this.fieldMap)));
  }

  async put({ id, name, fields, attr }) {
    const page = await this.get({ id }, { raw: true });

    const updatedAt = new Date().valueOf();
    const Item = {
      ...page,
      ...attr,
      updatedAt
    };

    if (name) {
      Item.gs1sk = name;
    }

    if (fields) {
      Item.fields = fields;
      /** TODO: remove attributes not in fields */
    }

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
      Key: { pk: id, sk: "page#data" }
    };

    return this.docClient.delete(params).promise();
  }
}

module.exports = new Pages();
