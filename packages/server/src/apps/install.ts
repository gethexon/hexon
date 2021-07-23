import Koa, { Context } from "koa";
import Router from "@koa/router";
const app = new Koa();
const router = new Router();

router.get("/", (ctx: Context) => {
  ctx.status = 404;
});

app.use(router.routes());
app.use(router.allowedMethods());
export default app;
