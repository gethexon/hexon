import Koa from "koa";
import Router from "@koa/router";
import { CustomContext } from "../types";

const router = new Router();

router.get("/", (ctx: CustomContext) => {
  ctx.status = 200;
});

const app = new Koa();

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
