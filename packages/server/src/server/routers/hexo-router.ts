import { ERROR_CODE } from "@hexon/typedef"
import { Context } from "koa"
import { container } from "tsyringe"
import Router from "@koa/router"
import {
  HexoCoreInitError,
  HexoCoreInitiatingError,
} from "@/services/hexo-instance-service"
import { HexoService, InvalidPathOptionError } from "@/services/hexo-service"

const router = new Router()
router.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof HexoCoreInitError) {
      ctx.status = 500
      ctx.body = {
        code: ERROR_CODE.E_INIT,
        message: err.message,
      }
    } else if (err instanceof HexoCoreInitiatingError) {
      ctx.status = 503
      ctx.body = {
        code: ERROR_CODE.E_INITIATING,
        message: "hexo core initiating please wait for a second",
      }
    } else if (err instanceof InvalidPathOptionError) {
      ctx.status = 400
      ctx.body = {
        code: ERROR_CODE.E_INVALID_CREATE_OPTION_PATH,
        message: "hexo core initiating please wait for a second",
      }
    } else if (err instanceof Error && err.message === "not found") {
      ctx.status = 404
      ctx.body = {
        code: ERROR_CODE.E_NOT_FOUND,
        message: "not found",
      }
    } else throw err
  }
})
router.get("/posts", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  ctx.body = await hexo.listPost()
})
router.get("/post/:source", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { source } = ctx.params
  if (!source) {
    ctx.status = 400
    ctx.body = "need `source`"
  }
  ctx.body = await hexo.getPostBySource(decodeURIComponent(source))
})
router.get("/pages", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  ctx.body = await hexo.listPage()
})
router.get("/page/:source", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { source } = ctx.params
  if (!source) {
    ctx.status = 400
    ctx.body = "need `source`"
  }
  ctx.body = await hexo.getPageBySource(decodeURIComponent(source))
})
router.get("/tags", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  ctx.body = await hexo.listTag()
})
router.get("/categories", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  ctx.body = await hexo.listCategory()
})
router.post("/deploy", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  await hexo.deploy(ctx.request.body)
  ctx.status = 200
})
router.post("/generate", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  await hexo.generate(ctx.request.body)
  ctx.status = 200
})
router.post("/clean", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  await hexo.clean()
  ctx.status = 200
})
router.post("/publish", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { filename, layout } = ctx.request.body
  if (!filename) {
    ctx.status = 400
    ctx.body = "need `filename`"
    return
  }
  ctx.body = await hexo.publish(filename, layout)
})
router.post("/create", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { title, layout, path, slug, replace } = ctx.request.body
  if (!title) {
    ctx.status = 400
    ctx.body = "need `title`"
    return
  }
  ctx.body = await hexo.create(title, { layout, path, slug, replace })
})
router.put("/post/:source", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { source } = ctx.params
  const { raw } = ctx.request.body

  if (!source || !raw) {
    ctx.status = 400
    ctx.body = "need `source` and `raw`"
    return
  }
  ctx.body = await hexo.update(source, raw, "post")
})
router.put("/page/:source", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { source } = ctx.params
  const { raw } = ctx.request.body
  if (!source || !raw) {
    ctx.status = 400
    ctx.body = "need `source` and `raw`"
    return
  }
  ctx.body = await hexo.update(source, raw, "page")
})
router.delete("/post/:source", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { source } = ctx.params
  if (!source) {
    ctx.status = 400
    ctx.body = "need `source` "
    return
  }
  ctx.body = await hexo.delete(source, "post")
})
router.delete("/page/:source", async (ctx: Context) => {
  const hexo = container.resolve(HexoService)
  const { source } = ctx.params
  if (!source) {
    ctx.status = 400
    ctx.body = "need `source` "
    return
  }
  ctx.body = await hexo.delete(source, "page")
})
export default router
