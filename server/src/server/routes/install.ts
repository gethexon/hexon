import Router from "@koa/router"
import { Context } from "koa"
import { container } from "tsyringe"
import { InstallService } from "@/services/install-service"

const router = new Router()
router.prefix("/install")
router.get("/", (ctx) => {
  const service = container.resolve(InstallService)
  if (service.isInstalled()) {
    ctx.status = 404
  } else {
    ctx.status = 200
    ctx.body = "Waiting For Install"
  }
})

router.post("/", async (ctx: Context) => {
  const service = container.resolve(InstallService)
  if (service.isInstalled()) {
    ctx.status = 404
    return
  }
  const { username, password, secret, expiresIn, refreshableIn } =
    ctx.request.body
  if (
    [username, password, secret, expiresIn, refreshableIn].some(
      (value) => !value
    )
  )
    ctx.status = 400
  else {
    await service.install({
      username,
      password,
      secret,
      expiresIn,
      refreshableIn,
    })
    ctx.status = 200
  }
})
export default router
