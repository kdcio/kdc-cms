const Koa = require("koa");
const json = require("koa-json");
const bodyParser = require("koa-bodyparser");
const routes = require("./routes");

const app = new Koa();

app.use(bodyParser());
app.use(json());
app.use(routes.routes());

module.exports = app;
