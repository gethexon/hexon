const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaLogger = require('koa-logger')

require('../src/auth/authService')
require('../src/install/installService')
require('../src/hexo/core')

const DI = require('./util/di')
const { ILogService } = require('./base/logService')
const logService = DI.inject(ILogService)
const serverLogger = logService.get('server')
const httpLogger = logService.get('http')

// error handler
onerror(app)
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      message: err.message
    }
    if (ctx.status === 500) {
      ctx.body.message = 'server internal error. Fix problem and try again later. This can be caused by unexpected input or server error.'
      serverLogger.error(500, err)
    }
  }
})

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(koaLogger((str, args) => {
  // redirect koa logger to other output pipe
  // default is process.stdout(by console.log function)
  httpLogger.info(str)
}))

app.use(require('koa-static')(require('path').resolve(__dirname, '../../web/dist/pwa')))

const install = require('./install/router')
app.use(install.routes(), install.allowedMethods())

const auth = require('./auth/router')
const { jwtAuth, requestAccessToken } = require('./auth/controller')
app.use(auth.routes(), auth.allowedMethods())
app.use(jwtAuth)
app.use(requestAccessToken)

const hexo = require('./hexo/router')
app.use(hexo.routes(), hexo.allowedMethods())

module.exports = app
