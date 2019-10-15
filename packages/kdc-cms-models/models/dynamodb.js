const AWS = require("aws-sdk");

if (process.env.AWS_PROFILE) {
  const credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE
  });
  AWS.config.credentials = credentials;
}

if (process.env.DYNAMODB_ENDPOINT) {
  AWS.config.update({
    region: process.env.AWS_REGION || "ap-southeast-1",
    endpoint: process.env.DYNAMODB_ENDPOINT
  });
} else {
  AWS.config.update({
    region: process.env.AWS_REGION || "ap-southeast-1"
  });
}

class DynamoDB {
  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10"
    });
    this.tableName = process.env.DYNAMODB_TABLE || "kdc-cms-local";
  }
}

module.exports = DynamoDB;
