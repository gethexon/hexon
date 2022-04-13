import { container } from "tsyringe"
import cors from "@koa/cors"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import compress from "koa-compress"
import logger from "koa-logger"
import mount from "koa-mount"
import onerror from "koa-onerror"
import { auth } from "./middlewares/auth"
import { statics } from "./middlewares/statics"
import { LogService } from "./services/log-service"
import httpSecure from "./lib/http-secure"
import router from "./routes"

const logService = container.resolve(LogService)
logService.setScope("app")

const app = new Koa()

onerror(app, {
  all(err) {
    logService.error(err)
  },
})

app.use(bodyParser())
app.use(compress())
app.use(httpSecure())
app.use(logger())

app.use(mount("/", statics))

app.use(auth.router.routes())
app.use(router.routes())

export default app
