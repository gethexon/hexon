/**
 * main app
 *
 * - polyfill ready
 * - di ready
 */

import path from "path";
import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import onerror from "koa-onerror";
import cors from "@koa/cors";
import account, { auth } from "./koa-account";
import entry from "./entry.ts";
import { DEV } from "./utils.ts";

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

app.use(
  account({
    base: "/auth",
    path: path.resolve(__dirname, "../data/account.db"),
    secret: "secret",
    expiresIn: "10min",
    refreshableIn: "7d",
  })
);

app.use(auth());

app.use(entry);

export default app;
