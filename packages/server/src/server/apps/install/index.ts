import Koa, { Context, Next } from "koa";
import Router from "@koa/router";
import { container } from "tsyringe";
import { InstallService } from "./service";
const app = new Koa();
const router = new Router();

export const checkInstall = () => async (ctx: Context, next: Next) => {
  const service = container.resolve(InstallService);
  if (!service.isInstalled()) {
    ctx.status = 404;
    ctx.body = "Install required";
  } else await next();
};

router.get("/", (ctx) => {
  const service = container.resolve(InstallService);
  if (service.isInstalled()) {
    ctx.status = 404;
  } else {
    ctx.status = 200;
    ctx.body = "Waiting For Install";
  }
});

router.post("/", async (ctx: Context) => {
  const service = container.resolve(InstallService);
  if (service.isInstalled()) {
    ctx.status = 404;
    return;
  }
  const { username, password, secret, expiresIn, refreshableIn } =
    ctx.request.body;
  if (
    [username, password, secret, expiresIn, refreshableIn].some(
      (value) => !value
    )
  )
    ctx.status = 400;
  else {
    await service.install({
      username,
      password,
      secret,
      expiresIn,
      refreshableIn,
    });
    ctx.status = 200;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
export default app;
