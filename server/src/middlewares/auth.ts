import { AuthenticationError, createAuth } from '@winwin/koa-authentication'
import { container } from 'tsyringe'
import { AccountService } from '@server-shared/account-storage-service'
import { AuthStorageService } from '@server/services/auth-storage-service'
import { LogService } from '@server-shared/log-service'

export const auth = createAuth({
  verify(username, password) {
    const logger = container.resolve(LogService)
    const account = container.resolve(AccountService)
    const res = account.verify(username, password)
    logger.log(`verify ${res ? 'success' : 'failed'} for ${username}`)
    return res
  },
  secret() {
    return container.resolve(AuthStorageService).getSecret()
  },
})

auth.router.post('/password', auth.auth, (ctx) => {
  const account = container.resolve(AccountService)
  const { oldPassword, password } = ctx.request.body as { oldPassword: string, password: string }
  const verified = account.verify(ctx.state.user!.username, oldPassword)
  if (!verified)
    throw new AuthenticationError()
  account.setPassword(password)
  ctx.status = 200
})

auth.router.post(
  '/username',
  auth.auth,
  (ctx, next) => {
    const account = container.resolve(AccountService)
    const { username } = ctx.request.body as { username: string }
    account.setUsername(username)
    ctx.state.user!.username = username
    return next()
  },
  auth.cookie,
  ctx => (ctx.status = 200),
)
