import path from "path";
import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import onerror from "koa-onerror";
import cors from "@koa/cors";

import apps from "./apps/index.ts";
import account from "./account.ts";
import statics from "./lib/statics.ts";
import { DEV } from "./utils.ts";
import mount from "koa-mount";

const app = new Koa();

onerror(app);
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

app.use(mount("/", statics(path.resolve(__dirname, "../../hexon-web/dist"))));
app.use(account.middleware);

app.use(apps);

export default app;
