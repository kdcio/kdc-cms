const DynamoDB = require('./dynamodb');
const PageDefinition = require('./pageDefinition');

class Pages extends DynamoDB {
  async post({ id, ...attr }) {
    const definition = await PageDefinition.get({ id });
    const createdAt = new Date().valueOf();
    const Item = {
      pk: id,
      sk: 'page#data',
      gs1pk: 'page#data',
      gs1sk: definition.gs1sk,
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
      Key: { pk: id, sk: 'page#data' }
    };

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject(new Error({ code: 'PageNotFound' }));
        }
        return data.Item;
      });
  }

  list() {
    const params = {
      TableName: this.tableName,
      IndexName: 'GS1',
      KeyConditionExpression: 'gs1pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'page#data'
      }
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data);
  }

  async put({ id, attr }) {
    const page = await this.get({ id });

    const updatedAt = new Date().valueOf();
    const Item = {
      ...page,
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
      Key: { pk: id, sk: 'page#data' }
    };

    return this.docClient.delete(params).promise();
  }
}

module.exports = new Pages();
