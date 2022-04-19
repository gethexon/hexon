import { Context } from "koa"
import Router from "@koa/router"

const router = new Router()

router.get("/health", (ctx: Context) => {
  ctx.status = 200
})

export default router
