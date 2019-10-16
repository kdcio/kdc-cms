const AWS = require("aws-sdk");

if (process.env.AWS_PROFILE) {
  const credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE
  });
  AWS.config.credentials = credentials;
}

if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: "localhost",
    endpoint: "http://localhost:8103"
  });
} else {
  AWS.config.update({
    region: process.env.DDB_REGION || "ap-southeast-1",
    httpOptions: {
      timeout: 5000
    }
  });
}

class DynamoDB {
  constructor() {
    this.docClient = new AWS.DynamoDB.DocumentClient({
      apiVersion: "2012-08-10"
    });
    this.tableName = process.env.DYNAMODB_TABLE || "kdc-cms-database-local";

    console.log(AWS.config);
    console.log(this.tableName);
  }
}

module.exports = DynamoDB;
