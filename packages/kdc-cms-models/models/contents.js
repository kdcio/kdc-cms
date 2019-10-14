const DynamoDB = require("./dynamodb");
const remap = require("../utils/remap");
const ContentDefinition = require("./contentDefinition");

class Contents extends DynamoDB {
  constructor() {
    super();
    this.fieldMap = {
      pk: "Slug"
    };
  }

  async post({ Slug, id, ...attr }) {
    const definition = await ContentDefinition.get({ id });
    const validAttr = {};
    definition.fields.forEach(f => {
      if (attr[f.name]) {
        validAttr[f.name] = attr[f.name];
      }
    });
    if (attr.createdAt) {
      validAttr.createdAt = attr.createdAt;
    }
    if (attr.updatedAt) {
      validAttr.updatedAt = attr.updatedAt;
    }

    const createdAt = new Date().valueOf();
    const Item = {
      pk: Slug,
      sk: `content#${id}`,
      gs1pk: `content#${id}`,
      gs1sk: validAttr[definition.sortKey],
      sortKeyUsed: definition.sortKey,
      createdAt,
      ...validAttr
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

  get({ id, slug }, opts = {}) {
    const params = {
      TableName: this.tableName,
      Key: { pk: slug, sk: `content#${id}` }
    };
    const { raw } = opts;

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject(
            new Error({ code: "ContentNotFound", message: "Content not found" })
          );
        }

        if (raw) return data.Item;

        const { fields, sortKeyUsed, ...attr } = data.Item;
        const map = { ...this.fieldMap };
        map.gs1sk = sortKeyUsed;
        return remap(attr, map);
      });
  }

  list(id) {
    const params = {
      TableName: this.tableName,
      IndexName: "GS1",
      KeyConditionExpression: "gs1pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `content#${id}`
      },
      ExpressionAttributeNames: {
        "#Name": "Name"
      },
      ProjectionExpression:
        "pk, gs1sk, #Name, createdAt, updatedAt, sortKeyUsed",
      ScanIndexForward: false
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data =>
        data.Items.map(i => {
          const map = { ...this.fieldMap };
          const { sortKeyUsed, ...attr } = i;
          map.gs1sk = sortKeyUsed;
          return remap(attr, map);
        })
      );
  }

  async put({ id, slug, attr }) {
    const updatedAt = new Date().valueOf();
    const current = await this.get({ id, slug });
    if (attr.Slug && slug !== attr.Slug) {
      await this.delete({ id, slug });
      return this.post({
        id,
        ...current,
        ...attr,
        updatedAt
      });
    }

    delete current[current.sortKeyUsed];

    const definition = await ContentDefinition.get({ id });
    const validAttr = {};
    definition.fields.forEach(f => {
      if (attr[f.name]) {
        validAttr[f.name] = attr[f.name];
      }
    });

    const Item = {
      pk: slug,
      sk: `content#${id}`,
      ...current,
      ...validAttr,
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

  async delete({ id, slug }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: slug, sk: `content#${id}` }
    };

    return this.docClient.delete(params).promise();
  }
}

module.exports = new Contents();
