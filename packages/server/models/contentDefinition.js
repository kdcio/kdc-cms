const DynamoDB = require('./dynamodb');

class ContentDefinition extends DynamoDB {
  post({ name, type, ...attr }) {
    const createdAt = new Date().valueOf();
    const Item = {
      pk: type,
      sk: 'content',
      gs1pk: 'content',
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

  get({ type }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: type, sk: 'content' }
    };

    return this.docClient
      .get(params)
      .promise()
      .then(data => {
        if (!data.Item) {
          return Promise.reject(new Error({ code: 'ContentNotFound' }));
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
        ':pk': 'content'
      }
    };

    return this.docClient
      .query(params)
      .promise()
      .then(data => data);
  }

  async put({ type, attr }) {
    const content = await this.get({ type });

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

  async delete({ type }) {
    const params = {
      TableName: this.tableName,
      Key: { pk: type, sk: 'content' }
    };

    return this.docClient.delete(params).promise();
  }
}

module.exports = new ContentDefinition();
