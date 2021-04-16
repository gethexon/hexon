const Joi = require('joi')
const DI = require('../util/di')
const { IInstallService } = require('./installService')
exports.v = {
  install: Joi.object({
    secret: Joi.string().required(),
    expire: Joi.string().required(),
    refresh: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
  })
}
exports.checkInstalled = async (ctx, next) => {
  const installService = DI.inject(IInstallService)
  const installed = installService.checkInstalled()
  if (installed) {
    ctx.status = 404
  } else await next()
}
exports.notInstalled = async (ctx, next) => {
  ctx.status = 200
}
exports.install = async (ctx, next) => {
  const installService = DI.inject(IInstallService)
  const { secret, expire, refresh, username, password } = ctx.request.body
  await installService.install({ secret, expire, refresh, username, password })
  ctx.status = 200
}
