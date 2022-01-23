import { Context, Next } from "koa"
import { container } from "tsyringe"
import { AuthService } from "~/server/services/auth-service"
import { BasicAuthError } from "~/shared/account-storage-service"
import {
  EmptyAuthticationHeaderError,
  InvalidAuthticationHeaderError,
  InvalidTokenError,
  NotBasicAuthError,
  PassworCheckError,
  TokenBlockedError,
  TokenDecodeError,
  TokenTypeError,
} from "./errors"
import { TokenType } from "./interface"

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next()
  } catch (err) {
    if (
      err instanceof EmptyAuthticationHeaderError ||
      err instanceof InvalidAuthticationHeaderError ||
      err instanceof TokenBlockedError ||
      err instanceof InvalidTokenError ||
      err instanceof TokenTypeError ||
      err instanceof TokenDecodeError ||
      err instanceof NotBasicAuthError ||
      err instanceof PassworCheckError ||
      err instanceof BasicAuthError
    ) {
      ctx.body = err.name
      ctx.status = 401
    } else throw err
  }
}

export function createTokenAuthMiddleWare(type: TokenType = "access") {
  return async (ctx: Context, next: Next) => {
    const auth = container.resolve(AuthService)
    auth.verityToken(ctx, type)
    await next()
  }
}

export function createBasicAuthMiddleWare() {
  return async (ctx: Context, next: Next) => {
    const auth = container.resolve(AuthService)
    auth.verifyBasic(ctx)
    await next()
  }
}
