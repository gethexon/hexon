import { container } from "tsyringe"
import cors from "@koa/cors"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import compress from "koa-compress"
import logger from "koa-logger"
import mount from "koa-mount"
import { auth } from "./middlewares/auth"
import { statics } from "./middlewares/statics"
import { LogService } from "./services/log-service"
import httpSecure from "./lib/http-secure"
import router from "./routes"
import { HttpError } from "http-errors"

const logService = container.resolve(LogService)
logService.setScope("app")

const app = new Koa()

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    const err = (e instanceof Error ? e : new Error(e as any)) as HttpError
    const status = err.status || 500
    const message = err.message || "internal server error"
    const id = err.id || "UnkownError"
    ctx.status = status
    ctx.body = { status, message, id }
  }
})

app.use(bodyParser())
app.use(compress())
app.use(httpSecure())
app.use(logger())

app.use(mount("/", statics))

app.use(auth.router.routes())
app.use(router.routes())

export default app
