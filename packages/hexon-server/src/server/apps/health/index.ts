import Koa, { Context } from "koa"
import Router from "@koa/router"

const router = new Router()

router.get("/", (ctx: Context) => {
  ctx.status = 200
})

const app = new Koa()

app.use(router.routes())
app.use(router.allowedMethods())

export default app
