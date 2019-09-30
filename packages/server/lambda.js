const serverless = require("aws-serverless-koa");
const app = require("./app");

module.exports.handler = serverless(app);
