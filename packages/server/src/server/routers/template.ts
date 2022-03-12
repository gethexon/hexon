import Router from "@koa/router"
import { container } from "tsyringe"
import { createErrorResponse, ERROR_CODE } from "../../../../typedef/src"
import { createTokenAuthMiddleWare } from "../apps/account"
import { FrontmatterTemplateService } from "../services/frontmatter-template-service"

const router = new Router()

router.use(createTokenAuthMiddleWare())

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
  if (!items) {
    ctx.status = 400
    ctx.body = createErrorResponse(
      ERROR_CODE.E_BAD_REQUEST,
      "`raw` is required"
    )
    return
  }
  const frontmatterTemplateService = container.resolve(
    FrontmatterTemplateService
  )
  await frontmatterTemplateService.set(items)
  ctx.status = 200
  ctx.body = { message: "OK" }
})

export default router
