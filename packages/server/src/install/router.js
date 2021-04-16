const Router = require('koa-router')
const { validateRequestBody } = require('../util/middlewares')
const controller = require('./controller')
const router = new Router()
router.prefix('/install')
router.use(controller.checkInstalled)
router.get('/', controller.notInstalled)
router.post('/', validateRequestBody(controller.v.install), controller.install)
module.exports = router
