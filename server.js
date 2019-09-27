const Koa = require("koa");
const Router = require("@koa/router");
const responseTime = require("koa-response-time");
const next = require("next");

const api = require("./api/index");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(responseTime());

  router.get("/admin", async ctx => {
    await app.render(ctx.req, ctx.res, "/admin", ctx.query);
    ctx.respond = false;
  });

  router.all("/admin", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(router.routes());
  server.use(api.routes());

  server.listen(port);
});
