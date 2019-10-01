const AWS = require("aws-sdk");

if (process.env.NODE_ENV !== "production") {
  AWS.config.update({
    region: "ap-southeast-1",
    endpoint: "http://localhost:8000/"
  });
}

class DynamoDB {
  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10"
    });
    this.tableName = process.env.DYNAMODB_TABLE
      ? process.env.DYNAMODB_TABLE
      : "kdc-cms";
  }
}

module.exports = DynamoDB;
