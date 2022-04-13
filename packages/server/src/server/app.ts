import cors from "@koa/cors"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import compress from "koa-compress"
import logger from "koa-logger"
import onerror from "koa-onerror"
import mount from "koa-mount"
import apps from "./apps/index"
import httpSecure from "./lib/http-secure"
import { statics } from "./apps/statics"
import { auth } from "./middlewares/auth"
import hexo from "./routes/hexo-router"
import { container } from "tsyringe"
import { LogService } from "./services/log-service"

const logService = container.resolve(LogService)
logService.setScope("app")

const app = new Koa()

onerror(app, {
  all(err) {
    logService.error(err)
  },
})

app.use(cors())

app.use(bodyParser())
app.use(httpSecure())
app.use(logger())

app.use(compress())
app.use(mount("/", statics))

app.use(auth.router.routes())
app.use(apps)
app.use(hexo.routes())

export default app
