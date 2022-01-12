import { Context, Next } from "koa"
import { container } from "tsyringe"
import { InstallService } from "./service"

export const checkInstall = () => async (ctx: Context, next: Next) => {
  const service = container.resolve(InstallService)
  if (!service.isInstalled()) {
    ctx.status = 404
    ctx.body = "Install required"
  } else await next()
}
