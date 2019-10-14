const AWS = require('aws-sdk');

if (process.env.NODE_ENV !== 'production') {
  AWS.config.update({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8103/'
  });
}

class DynamoDB {
  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient({
      apiVersion: '2012-08-10'
    });
    this.tableName = process.env.DYNAMODB_TABLE || 'kdc-cms';
  }
}

module.exports = DynamoDB;
