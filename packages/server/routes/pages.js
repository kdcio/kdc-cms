const Router = require("@koa/router");
const Pages = require("../models/pages");

const router = new Router();

router
  .get("/", async ctx => {
    const list = await Pages.list();
    ctx.status = 200;
    ctx.body = list.Items;
  })
  .post("/", async ctx => {
    const { body } = ctx.request;
    const id = await Pages.post(body);
    ctx.status = 201;
    ctx.body = { id };
  })
  .put("/:id", async ctx => {
    const { id } = ctx.params;
    const { body } = ctx.request;
    await Pages.put({ id, attr: body });
    ctx.status = 204;
    ctx.body = {};
  })
  .del("/:id", async ctx => {
    const { id } = ctx.params;
    await Pages.delete({ id });
    ctx.status = 204;
    ctx.body = {};
  })
  .get("/:id", async ctx => {
    const { id } = ctx.params;
    const page = await Pages.get({ id });
    ctx.status = 200;
    ctx.body = page;
  });

module.exports = router;
