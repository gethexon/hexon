import type { Context, Next } from "koa"
import type { IAuthInfo, IStorageService, IUserInfoWithPwd } from "./storage"
import fs from "fs"
import compose from "koa-compose"
import path from "path"
import { AuthService } from "./auth"
import { defaultUserInfo } from "./constants"
import {
  BasicAuthError,
  EmptyAuthticationHeaderError,
  InvalidAuthticationHeaderError,
  InvalidTokenError,
  NotBasicAuthError,
  TokenBlockedError,
  TokenDecodeError,
  TokenTypeError,
} from "./errors"
import { StorageService } from "./storage"
import { debug } from "./utils"
import createRouter from "./router"

interface IConfig {
  path: string
  secret: string
  expiresIn: string
  refreshableIn: string
  base?: string
  storage: IStorageService
  logger?: (message: string) => void
}

const initialize = (config: IConfig) => {
  //#region options
  const authInfo: IAuthInfo = {
    secret: config.secret,
    expiresIn: config.expiresIn,
    refreshableIn: config.refreshableIn,
  }
  const logger = config.logger ?? (() => {})
  //#endregion

  //#region services
  const dirname = path.dirname(config.path) // db file
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname)
    debug(`create database: ${dirname}`)
  }
  const storage = new StorageService(config.storage)
  const auth = new AuthService(storage)
  //#endregion

  //#region auth info
  if (!storage.installed()) {
    storage.setUserInfo(defaultUserInfo)
    storage.setAuthInfo(authInfo)
    storage.setInstalled()
    debug(`first install: set defualt userinfo`)
  }
  //#endregion

  //#region helpers
  const setAuthInfo = (newInfo: Partial<IAuthInfo> = {}) => {
    storage.setAuthInfo({ ...storage.getAuthInfo(), ...newInfo })
  }
  const setUserInfo = ({
    username,
    password,
  }: Partial<IUserInfoWithPwd> = {}) => {
    username && storage.changeUsername(username)
    password && storage.changePassword(password)
  }
  //#endregion

  //#region router
  const router = createRouter(storage, auth, logger)
  router.prefix(config.base || "")
  //#endregion

  const errorHandler = async (ctx: Context, next: Next) => {
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
        err instanceof BasicAuthError
      ) {
        ctx.body = err.name
        ctx.status = 401
        logger(err.name)
      } else throw err
    }
  }

  return { router, auth, setAuthInfo, setUserInfo, errorHandler }
}

export function createSimpleAccount(config: IConfig) {
  const { router, auth, setAuthInfo, setUserInfo, errorHandler } =
    initialize(config)

  const middleware = compose([
    errorHandler,
    router.routes(),
    router.allowedMethods(),
  ])

  return {
    middleware,
    auth: auth.createMiddleware.bind(auth),
    setAuthInfo,
    setUserInfo,
  }
}
