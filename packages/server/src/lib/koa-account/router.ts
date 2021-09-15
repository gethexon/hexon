import Router from "koa-router";
import basicAuth from "basic-auth";
import { debug, end } from "./utils";
import { block, changePassword, changeUsername, getUserInfo } from "./storage";
import { auth, resolveAuthorizationHeader, sign } from "./auth";
import { Context } from "koa";
const router = new Router();

router.post("/signin", (ctx: Context) => {
  const user = basicAuth.parse(ctx.request.headers.authorization);
  if (!user) {
    debug("basic auth required");
    end(401, "Authentication Error");
  }
  const target = getUserInfo();
  if (user.name !== target.username || user.pass !== target.password) {
    debug("basic auth failed");
    end(401, "Authentication Error");
  }
  debug(`${target.username} signin`);
  ctx.body = sign(target);
});

router.post("/refresh", auth("refresh"), (ctx: Context) => {
  const target = getUserInfo();
  debug(`${target.username} refresh`);
  ctx.body = sign(target);
});

router.post("/signout", auth("refresh"), (ctx: Context) => {
  const refreshToken = resolveAuthorizationHeader(ctx);
  block(refreshToken);
  const accessToken = ctx.request.body.access as string;
  if (accessToken) block(accessToken);
  ctx.status = 200;
});

router.put("/info", auth("access"), (ctx: Context) => {
  const { username, password }: { username?: string; password?: string } =
    ctx.request.body;
  if (username) changeUsername(username);
  if (password) changePassword(password);
  ctx.status = 200;
});

router.get("/info", auth("access"), (ctx: Context) => {
  ctx.body = { username: getUserInfo().username };
});

export default router;
