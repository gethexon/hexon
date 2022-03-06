import { container } from "tsyringe"
import Router from "@koa/router"
import { createTokenAuthMiddleWare } from "@/apps/account"
import { SettingsService } from "@/services/settings-service"

const router = new Router()

router.use(createTokenAuthMiddleWare())

router.get("/settings", async (ctx) => {
  const settingsService = container.resolve(SettingsService)
  ctx.body = await settingsService.get()
})

router.post("/settings", async (ctx) => {
  const settingsService = container.resolve(SettingsService)
  const settings = ctx.request.body ?? {}
  await settingsService.set(settings)
  ctx.status = 200
})

export default router
