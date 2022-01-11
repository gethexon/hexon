import type { Context, Next } from "koa"
import type { IUserInfo, IUserInfoWithPwd, StorageService } from "./storage"
import type { tokenType } from "./types"
import jwt from "jsonwebtoken"
import {
  BasicAuthError,
  EmptyAuthticationHeaderError,
  InvalidAuthticationHeaderError,
  InvalidTokenError,
  NotBasicAuthError,
  PassworCheckError,
  TokenBlockedError,
  TokenDecodeError,
  TokenTypeError,
} from "./errors"
import { debug, encrypt } from "./utils"

export class AuthService {
  constructor(private storage: StorageService) {}

  resolveBasicAuth(ctx: Context) {
    const user = ctx.request.body
    if (!user || !("username" in user) || !("password" in user)) {
      throw new NotBasicAuthError()
    } else {
      return user as IUserInfoWithPwd
    }
  }

  resolveAuthorizationHeader(ctx: Context) {
    if (!ctx.header || !ctx.header.authorization) {
      throw new EmptyAuthticationHeaderError()
    }

    const parts = ctx.header.authorization.split(" ")

    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]

      if (/^Bearer$/i.test(scheme)) {
        return credentials
      }
    }
    throw new InvalidAuthticationHeaderError()
  }

  createMiddleware(type: tokenType = "access") {
    return async (ctx: Context, next: Next) => {
      const token = this.resolveAuthorizationHeader(ctx)
      if (this.storage.isBlocked(token)) {
        debug("token has been blocked")
        throw new TokenBlockedError()
      }
      try {
        jwt.verify(token, this.storage.getAuthInfo().secret)
      } catch (err) {
        if (
          err instanceof Error &&
          ["JsonWebTokenError", "TokenExpiredError"].includes(err.name)
        ) {
          debug(`fail to verify token`)
          throw new InvalidTokenError()
        } else throw err
      }
      const user = jwt.decode(token)

      if (
        user &&
        typeof user !== "string" &&
        typeof user.username === "string" &&
        typeof user.type === "string" &&
        (user.type === "access" || user.type === "refresh")
      ) {
        if (user.type !== type) {
          debug(`wrong token type: ${type} is required but found ${user.type}`)
          throw new TokenTypeError(type)
        } else {
          ctx.state.user = { username: user.username, type: user.type }
          await next()
        }
      } else {
        debug(`fail to decode token: `, user)
        throw new TokenDecodeError()
      }
    }
  }

  sign(user: IUserInfo) {
    debug(`sign for ${user.username}`)
    const authInfo = this.storage.getAuthInfo()
    const accessToken = jwt.sign(
      { username: user.username, type: "access" },
      authInfo.secret,
      {
        expiresIn: authInfo.expiresIn,
      }
    )
    const refreshToken = jwt.sign(
      { username: user.username, type: "refresh" },
      authInfo.secret,
      {
        expiresIn: authInfo.refreshableIn,
      }
    )
    return { accessToken, refreshToken }
  }

  createBasicAuth() {
    const auth = this
    return async function basicAuth(ctx: Context, next: Next) {
      const user = auth.resolveBasicAuth(ctx)
      if (!user) {
        debug("basic auth required")
        throw new NotBasicAuthError()
      }
      const target = auth.storage.getUserInfo()
      if (
        user.username !== target.username ||
        encrypt(user.password) !== target.password
      ) {
        debug("basic auth failed")
        throw new BasicAuthError()
      }
      await next()
    }
  }

  createPasswordCheck() {
    const auth = this
    return async function passwordCheck(ctx: Context, next: Next) {
      const target = auth.storage.getUserInfo()
      if (encrypt(ctx.request.body.oldPassword) !== target.password) {
        debug("password check failed")
        throw new PassworCheckError()
      }
      await next()
    }
  }
}
