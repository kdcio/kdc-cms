const Koa = require("koa");
const responseTime = require("koa-response-time");

const api = require("./api/index");

const port = parseInt(process.env.PORT, 10) || 3000;

const server = new Koa();

server.use(responseTime());

server.use(api.routes());

server.listen(port);
