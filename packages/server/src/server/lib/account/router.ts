import type { Context } from "koa"
import type { AuthService } from "./auth"
import type { StorageService } from "./storage"
import Router from "@koa/router"
import { debug } from "./utils"

export default function createRouter(
  storage: StorageService,
  auth: AuthService,
  logger: (message: string) => void
) {
  const router = new Router()

  router.post("/signin", auth.createBasicAuth(), (ctx: Context) => {
    const user = auth.resolveBasicAuth(ctx)
    debug(`${user.username} signin`)
    logger(`${user.username} signin`)
    ctx.body = auth.sign(user)
  })

  router.post("/refresh", auth.createMiddleware("refresh"), (ctx: Context) => {
    const target = storage.getUserInfo()
    debug(`${target.username} refresh`)
    logger(`${target.username} signin`)
    ctx.body = auth.sign(target)
  })

  router.post("/signout", auth.createMiddleware("refresh"), (ctx: Context) => {
    const refreshToken = auth.resolveAuthorizationHeader(ctx)
    if (refreshToken) storage.block(refreshToken)
    const accessToken = ctx.request.body.access as string
    if (accessToken) storage.block(accessToken)
    logger(`signout`)
    ctx.status = 200
  })

  router.put(
    "/info",
    auth.createMiddleware("access"),
    auth.createPasswordCheck(),
    (ctx: Context) => {
      const {
        username,
        password,
      }: { oldpassword: string; username?: string; password?: string } =
        ctx.request.body
      if (username) storage.changeUsername(username)
      if (password) storage.changePassword(password)
      logger(`update info`)
      ctx.status = 200
    }
  )

  router.get("/info", auth.createMiddleware("access"), (ctx: Context) => {
    ctx.body = { username: storage.getUserInfo().username }
  })

  router.use(async (ctx, next) => {
    await next()
  })

  return router
}
