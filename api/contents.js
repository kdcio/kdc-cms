const Router = require("@koa/router");

const router = new Router();

router
  .get("/", ctx => {
    ctx.body = "list of types";
  })
  .get("/:type", ctx => {
    // console.log(ctx.params.id);
    ctx.body = "list of content by type";
  })
  .get("/:type/:slug", ctx => {
    // console.log(ctx.params.id);
    ctx.body = "content info";
  });

module.exports = router;
