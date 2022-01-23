import { container } from "tsyringe"
import Router from "@koa/router"
import { AuthService } from "@/services/auth-service"
import { AccountService } from "~/shared/account-storage-service"
import {
  createBasicAuthMiddleWare,
  createTokenAuthMiddleWare,
} from "./controller"

const router = new Router()

router.post("/signin", createBasicAuthMiddleWare(), async (ctx, next) => {
  const auth = container.resolve(AuthService)
  ctx.body = auth.sign(ctx.state.user.username)
})

router.post("/refresh", createTokenAuthMiddleWare("refresh"), (ctx) => {
  const auth = container.resolve(AuthService)
  ctx.body = auth.sign(ctx.state.user.username)
})

router.post("/signout", createTokenAuthMiddleWare("refresh"), (ctx) => {
  const auth = container.resolve(AuthService)
  auth.signout(ctx)
  ctx.status = 200
})

router.put("/info/username", createTokenAuthMiddleWare("access"), (ctx) => {
  const username = ctx.request.body.username || ""
  if (username) {
    const account = container.resolve(AccountService)
    account.setUsername(username)
    ctx.status = 200
  } else {
    ctx.status = 400
  }
})

router.put("/info/password", createTokenAuthMiddleWare("access"), (ctx) => {
  const password = ctx.request.body.password || ""
  if (password) {
    const account = container.resolve(AccountService)
    account.setPassword(password)
    ctx.status = 200
  } else {
    ctx.status = 400
  }
})

router.get("/info", createTokenAuthMiddleWare("access"), (ctx) => {
  const account = container.resolve(AccountService)
  ctx.body = { username: account.getUsername() }
})

router.use(async (ctx, next) => {
  await next()
})

export default router
