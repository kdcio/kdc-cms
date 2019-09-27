const Router = require("@koa/router");

const router = new Router();

router
  .get("/", ctx => {
    ctx.body = "list of pages";
  })
  .get("/:id", ctx => {
    // console.log(ctx.params.id);
    ctx.body = "pages info";
  });

module.exports = router;
