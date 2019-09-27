const Router = require("@koa/router");
const Pages = require("./pages");
const Contents = require("./contents");

const router = new Router();

router.get("/api", ctx => {
  ctx.body = "Welcome to KDC CMS!";
});

router.use("/api/pages", Pages.routes());
router.use("/api/contents", Contents.routes());

module.exports = router;
