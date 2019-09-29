const Router = require("@koa/router");
const PageDefinition = require("../models/pageDefinition");

const router = new Router();

router
  .get("/", async ctx => {
    const list = await PageDefinition.list();
    ctx.status = 200;
    ctx.body = list.Items;
  })
  .post("/", async ctx => {
    const { body } = ctx.request;
    const id = await PageDefinition.post(body);
    ctx.status = 201;
    ctx.body = { id };
  })
  .put("/:id", async ctx => {
    const { id } = ctx.params;
    const { body } = ctx.request;
    await PageDefinition.put({ id, attr: body });
    ctx.status = 204;
    ctx.body = {};
  })
  .del("/:id", async ctx => {
    const { id } = ctx.params;
    await PageDefinition.delete({ id });
    ctx.status = 204;
    ctx.body = {};
  })
  .get("/:id", async ctx => {
    const { id } = ctx.params;
    const page = await PageDefinition.get({ id });
    ctx.status = 200;
    ctx.body = page;
  });

module.exports = router;
