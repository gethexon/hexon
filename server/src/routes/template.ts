import Router from "@koa/router"
import { container } from "tsyringe"
import { FrontmatterTemplateService } from "@server/services/frontmatter-template-service"
import { InvalidOptionsError } from "@server/errors"

const router = new Router()

router.prefix("/template")

router.get("/frontmatter", async (ctx) => {
  const frontmatterTemplateService = container.resolve(
    FrontmatterTemplateService
  )
  const items = await frontmatterTemplateService.list()
  ctx.body = { items }
})

router.post("/frontmatter", async (ctx) => {
  const items = ctx.request.body?.items
  if (!items) throw new InvalidOptionsError("`raw` is required")
  const frontmatterTemplateService = container.resolve(
    FrontmatterTemplateService
  )
  await frontmatterTemplateService.set(items)
  ctx.status = 200
  ctx.body = { message: "OK" }
})

export default router
