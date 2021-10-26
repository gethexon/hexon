import Router from "@koa/router";
import { container } from "tsyringe";
import { Context } from "koa";
import Hexo from "./service";

const router = new Router();
router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error && err.message === "not found") {
      ctx.status = 404;
    } else throw err;
  }
});
router.get("/posts", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listPost();
});
router.get("/post/:source", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  const source = ctx.params.source;
  ctx.body = await hexo.getPostBySource(decodeURIComponent(source));
});
router.get("/pages", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listPage();
});
router.get("/page/:source", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  const source = ctx.params.source;
  ctx.body = await hexo.getPageBySource(decodeURIComponent(source));
});
router.get("/tags", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listTag();
});
router.get("/categories", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  ctx.body = await hexo.listCategory();
});
router.post("/deploy", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  await hexo.deploy(ctx.request.body);
  ctx.status = 200;
});
router.post("/generate", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  await hexo.generate(ctx.request.body);
  ctx.status = 200;
});
router.post("/clean", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  await hexo.clean();
  ctx.status = 200;
});
router.post("/publish", async (ctx: Context) => {
  const hexo = container.resolve(Hexo);
  const { filename, layout } = ctx.request.body;
  if (!filename) {
    ctx.status = 400;
    ctx.body = "need `filename`";
    return;
  }
  ctx.body = await hexo.publish(filename, layout);
});
export default router;
