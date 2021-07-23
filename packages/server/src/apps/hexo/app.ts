import Koa, { Context } from "koa";
import Router from "@koa/router";
import Hexo from "./services/hexo";
import { container } from "tsyringe";
import { createDebug } from "../../utils";
import chalk from "chalk";
import { StorageService } from "../../services/storage";
import { HEXO_BASE_DIR_KEY } from "../constants";
import { requireAccessToken } from "../../middlewares/auth";

const storage = container.resolve(StorageService);
const hexo = container.resolve(Hexo);

if (storage.get(HEXO_BASE_DIR_KEY))
  hexo.init().catch((err) => {
    console.log(chalk.red("Fail to initialize hexo, waiting for retry:"));
    console.log(chalk.red(err.message));
  });

const app = new Koa();
const router = new Router();

router.use(requireAccessToken);
router.get("/posts", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listPost();
});
router.get("/pages", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listPage();
});
router.get("/tags", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listTag();
});
router.get("/categories", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listCategory();
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
