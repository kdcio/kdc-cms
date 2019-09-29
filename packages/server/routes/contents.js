const Router = require("@koa/router");
const Contents = require("../models/contents");

const router = new Router();

router
  .get("/:type", async ctx => {
    const { type } = ctx.params;
    const list = await Contents.list(type);
    ctx.status = 200;
    ctx.body = list.Items;
  })
  .post("/:type", async ctx => {
    const { type } = ctx.params;
    const { body } = ctx.request;
    const slug = await Contents.post({ type, ...body });
    ctx.status = 201;
    ctx.body = { slug };
  })
  .put("/:type/:slug", async ctx => {
    const { type, slug } = ctx.params;
    const { body } = ctx.request;
    await Contents.put({ type, slug, attr: body });
    ctx.status = 204;
    ctx.body = {};
  })
  .del("/:type/:slug", async ctx => {
    const { type, slug } = ctx.params;
    await Contents.delete({ type, slug });
    ctx.status = 204;
    ctx.body = {};
  })
  .get("/:type/:slug", async ctx => {
    const { type, slug } = ctx.params;
    const page = await Contents.get({ type, slug });
    ctx.status = 200;
    ctx.body = page;
  });

module.exports = router;
