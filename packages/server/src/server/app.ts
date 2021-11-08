import path from "path";
import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import apps from "./apps/index";
import account from "./account";
import statics from "./lib/statics";
import { DEV } from "./utils";
import mount from "koa-mount";

const app = new Koa();

app.use(cors());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.status === 500) {
      ctx.body = { message: DEV ? err : "server internal error" };
      console.error(err);
    } else ctx.body = { message: err.message };
  }
});

app.use(logger());

app.use(
  bodyParser({
    enableTypes: ["json", "form", "text"],
  })
);

app.use(mount("/", statics(path.resolve(process.cwd(), "../hexon-web/dist"))));
app.use(account.middleware);

app.use(apps);

export default app;
