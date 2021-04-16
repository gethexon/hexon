// TODO: basic-auth
// TODO: jwt-auth
// TODO: apikey-auth
const auth = require('basic-auth')
const compose = require('koa-compose')
const DI = require('../util/di')
const { IStorageService } = require('../base/storageService')
const { IAuthService } = require('./authService')
const { ILogService } = require('../base/logService')
const Joi = require('joi')
const logger = DI.inject(ILogService).get('auth')

exports.v = {
  password: Joi.object({ password: Joi.string().required() })
}

exports.basicAuth = async function (ctx, next) {
  const authService = DI.inject(IAuthService)
  // get name and pass from reqest header
  const user = auth(ctx.request)
  if (!user) {
    // if not a valide basic auth header
    const err = new Error()
    err.status = 401
    err.message = 'basic authentication required'
    throw err
  } else {
    // find if user exist in database
    const valid = authService.basicAuth(user.name, user.pass)
    // let query = await User.find(user)
    if (valid) {
      await next()
    } else {
      const err = new Error()
      err.status = 401
      err.message = 'wrong username or password'
      throw err
    }
  }
}

exports.getToken = async function (ctx, next) {
  const authService = DI.inject(IAuthService)
  ctx.body = authService.getToken()
}
function extractToken (ctx) {
  return ctx.header.authorization.split(' ')[1]
}
function resolveAuthorizationHeader (ctx) {
  if (!ctx.header || !ctx.header.authorization) {
    return
  }

  const parts = ctx.header.authorization.split(' ')

  if (parts.length === 2) {
    const scheme = parts[0]
    const credentials = parts[1]

    if (/^Bearer$/i.test(scheme)) {
      return credentials
    }
  }
  throw new Error('Authtication Error')
}
exports.jwtAuth = compose([async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.message === 'Authtication Error') {
      ctx.status = 401
      ctx.body = {
        message: 'Authtication Error'
      }
    }
  }
}, async function (ctx, next) {
  const authService = DI.inject(IAuthService)
  // 为了动态读取secret
  const token = resolveAuthorizationHeader(ctx)
  if (!token) {
    throw new Error('Authtication Error')
  } else {
    try {
      const decoded = authService.verifyToken(token)
      ctx.state.user = decoded
    } catch (err) {
      throw new Error('Authtication Error')
    }
    await next()
  }
}])

/**
 * 检查当前refresh token是否在黑名单
 */
exports.blacklist = async (ctx, next) => {
  const storage = DI.inject(IStorageService)
  const token = extractToken(ctx)
  if ((storage.get('blacklist') || []).map(o => o.token).includes(token)) {
    logger.info('block invalid refresh token')
    const err = new Error()
    err.status = 401
    err.message = 'Authentication Error'
    throw err
  }
  await next()
}

exports.requestAccessToken = async function (ctx, next) {
  if (ctx.state.user.type !== 'access') {
    const err = new Error()
    err.status = 403
    err.message = 'Require Access Token'
    throw err
  }
  await next()
}
exports.requestRefreshToken = async function (ctx, next) {
  if (ctx.state.user.type !== 'refresh') {
    const err = new Error()
    err.status = 403
    err.message = 'Require Refresh Token'
    throw err
  }
  logger.info('refresh token used')
  await next()
}
exports.logout = async (ctx, next) => {
  const storage = DI.inject(IStorageService)
  const token = extractToken(ctx)
  let blacklist = (storage.get('blacklist') || [])
  const refreshTokens = (storage.get('refresh') || {})
  const refreshToken = refreshTokens[ctx.state.user.uuid]
  if (refreshToken) {
    blacklist.push({ token, exp: ctx.state.user.exp })
    blacklist = blacklist.filter(o => o.exp > parseInt((new Date()).valueOf() / 1000, 10))
    logger.info('block token')
    storage.set('blacklist', blacklist)
    delete refreshTokens[ctx.state.user.uuid]
    storage.set('refresh', refreshTokens)
  }
  ctx.status = 200
}
exports.info = async (ctx, next) => {
  const authService = DI.inject(IAuthService)
  ctx.body = authService.getUserInfo()
}
exports.password = async (ctx, next) => {
  const { password } = ctx.request.body
  const authService = DI.inject(IAuthService)
  ctx.body = authService.setSecurity({ password })
}
