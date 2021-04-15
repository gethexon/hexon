const Joi = require('joi')
const DI = require('../util/di')
const { IInstallService } = require('./installService')
exports.v = {
  install: Joi.object({
    root: Joi.string().required(),
    secret: Joi.string().required(),
    expire: Joi.string().required(),
    refresh: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  root: Joi.object({
    root: Joi.string().required()
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
  const { root, secret, expire, refresh, username, password } = ctx.request.body
  await installService.install({ root, secret, expire, refresh, username, password })
  ctx.status = 200
}
exports.checkRoot = async (ctx, next) => {
  const installService = DI.inject(IInstallService)
  const { root } = ctx.request.body
  await installService.checkIsBlog(root)
  ctx.status = 200
}
