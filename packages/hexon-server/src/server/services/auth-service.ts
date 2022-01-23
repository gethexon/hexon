import { Context } from "koa"
import { inject, injectable, singleton } from "tsyringe"
import jwt from "jsonwebtoken"
import {
  EmptyAuthticationHeaderError,
  InvalidAuthticationHeaderError,
  InvalidTokenError,
  NotBasicAuthError,
  TokenBlockedError,
  TokenDecodeError,
  TokenTypeError,
} from "@/apps/account/errors"
import { IUserInfo, TokenType } from "@/apps/account/interface"
import { AuthStorageService } from "@/services/auth-storage-service"
import { BlockService } from "@/services/block-service"
import { LogService } from "@/services/log-service"
import { AccountService } from "~/shared/account-storage-service"

interface ITokenPayload {
  username: string
  type: TokenType
}

@injectable()
@singleton()
export class AuthService {
  public static KEY = "authinfo"
  constructor(
    @inject(AuthStorageService) private _auth: AuthStorageService,
    @inject(AccountService) private _account: AccountService,
    @inject(BlockService) private _block: BlockService,
    @inject(LogService) private _logService: LogService
  ) {
    this._logService.setScope("auth-service")
  }

  private _resolveBasicAuth(ctx: Context) {
    const user = ctx.request.body
    if (!user || !("username" in user) || !("password" in user)) {
      throw new NotBasicAuthError()
    } else {
      return user as IUserInfo
    }
  }

  private _resolveAuthorizationHeader(ctx: Context) {
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

  private _verifyJwtToken(token: string) {
    try {
      jwt.verify(token, this._auth.getSecret())
    } catch (err) {
      if (
        err instanceof Error &&
        ["JsonWebTokenError", "TokenExpiredError"].includes(err.name)
      ) {
        throw new InvalidTokenError()
      } else throw err
    }
  }

  private _decodeToken(token: string) {
    const user = jwt.decode(token)
    if (
      !(
        user &&
        typeof user !== "string" &&
        typeof user.username === "string" &&
        typeof user.type === "string" &&
        (user.type === "access" || user.type === "refresh")
      )
    ) {
      throw new TokenDecodeError()
    }
    return user as ITokenPayload
  }

  private _verifyTokenType(user: ITokenPayload, type: TokenType) {
    if (user.type !== type) {
      throw new TokenTypeError()
    }
  }

  verityToken(ctx: Context, type: TokenType) {
    const token = this._resolveAuthorizationHeader(ctx)
    if (this._block.isBlocked(token)) {
      this._logService.log("blocked token attempt", token)
      throw new TokenBlockedError()
    }
    this._verifyJwtToken(token)
    const user = this._decodeToken(token)
    this._verifyTokenType(user, type)
    ctx.state.user = { username: user.username, type: user.type }
    this._logService.log(`token verified`, user.username)
  }

  verifyBasic(ctx: Context) {
    const user = this._resolveBasicAuth(ctx)
    this._account.verify(user.username, user.password)
    ctx.state.user = { username: user.username }
    this._logService.log(`basic verified`, user.username)
  }

  sign(username: string) {
    const { secret, expiresIn, refreshableIn } = this._auth.getAuthInfo()
    const accessToken = jwt.sign(
      { username: username, type: "access" },
      secret,
      { expiresIn: expiresIn }
    )
    const refreshToken = jwt.sign(
      { username: username, type: "refresh" },
      secret,
      { expiresIn: refreshableIn }
    )
    this._logService.log("token sign", username)
    return { accessToken, refreshToken }
  }

  signout(ctx: Context) {
    const token = this._resolveAuthorizationHeader(ctx)
    const toBlock: string[] = []
    if (token) toBlock.push(token)
    const access = ctx.request.body.access
    if (access) toBlock.push(token)
    this._block.block(toBlock)
    this._logService.log(`sign out`, ctx.state.user.username)
  }
}

declare module "koa" {
  interface DefaultState {
    user: {
      username: string
      type?: TokenType
    }
  }
}
