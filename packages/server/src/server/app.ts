import cors from "@koa/cors"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import compress from "koa-compress"
import logger from "koa-logger"
import mount from "koa-mount"
import { DEV } from "./utils"
import apps from "./apps/index"
import httpSecure from "./lib/http-secure"
import { statics } from "./apps/statics"
import { auth } from "./middlewares/auth"

const app = new Koa()

app.use(cors())
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    if (ctx.status === 500) {
      ctx.body = { message: DEV ? err : "server internal error" }
      console.error(err)
    } else ctx.body = { message: err.message }
  }
})

app.use(
  bodyParser({
    enableTypes: ["json", "form", "text"],
  })
)
app.use(compress())
app.use(httpSecure())
app.use(logger())

app.use(mount("/", statics))

app.use(auth.router.routes())
app.use(apps)

export default app
