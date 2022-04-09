import { createAuth } from "@winwin/koa-authentication"
import { container } from "tsyringe"
import { AuthStorageService } from "~/server/services/auth-storage-service"
import { AccountService } from "~/shared/account-storage-service"
export const auth = createAuth({
  verify(username, password) {
    const account = container.resolve(AccountService)
    account.verify(username, password)
  },
  secret() {
    return container.resolve(AuthStorageService).getSecret()
  },
})
auth.router.post("/password", auth.auth, (ctx) => {
  const account = container.resolve(AccountService)
  const { oldPassword, password } = ctx.request.body
  account.verify(ctx.state.user!.username, oldPassword)
  account.setPassword(password)
  ctx.status = 200
})

auth.router.post(
  "/username",
  auth.auth,
  (ctx, next) => {
    const account = container.resolve(AccountService)
    const { username } = ctx.request.body
    account.setUsername(username)
    ctx.state.user.username = username
    return next()
  },
  auth.cookie,
  (ctx) => (ctx.status = 200)
)
