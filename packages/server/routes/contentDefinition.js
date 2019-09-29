const Router = require("@koa/router");
const ContentDefinition = require("../models/contentDefinition");

const router = new Router();

router
  .get("/", async ctx => {
    const list = await ContentDefinition.list();
    ctx.status = 200;
    ctx.body = list.Items;
  })
  .post("/", async ctx => {
    const { body } = ctx.request;
    const type = await ContentDefinition.post(body);
    ctx.status = 201;
    ctx.body = { type };
  })
  .put("/:type", async ctx => {
    const { type } = ctx.params;
    const { body } = ctx.request;
    await ContentDefinition.put({ type, attr: body });
    ctx.status = 204;
    ctx.body = {};
  })
  .del("/:type", async ctx => {
    const { type } = ctx.params;
    await ContentDefinition.delete({ type });
    ctx.status = 204;
    ctx.body = {};
  })
  .get("/:type", async ctx => {
    const { type } = ctx.params;
    const page = await ContentDefinition.get({ type });
    ctx.status = 200;
    ctx.body = page;
  });

module.exports = router;
