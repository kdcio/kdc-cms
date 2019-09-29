const Router = require("@koa/router");
const pageDefinition = require("./pageDefinition");
const pages = require("./pages");
const contentDefinition = require("./contentDefinition");
const contents = require("./contents");

const router = new Router();

router.use(
  "/page-definition",
  pageDefinition.routes(),
  pageDefinition.allowedMethods()
);

router.use("/pages", pages.routes(), pages.allowedMethods());

router.use(
  "/content-definition",
  contentDefinition.routes(),
  contentDefinition.allowedMethods()
);

router.use("/contents", contents.routes(), contents.allowedMethods());

module.exports = router;
