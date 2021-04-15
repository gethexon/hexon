const Router = require('koa-router')
const controller = require('./controller')
const router = new Router()
router.post('/login', controller.basicAuth, controller.getToken)
router.post('/refresh', controller.jwtAuth, controller.blacklist, controller.requestRefreshToken, controller.getToken)
router.get('/info', controller.jwtAuth, controller.requestAccessToken, controller.info)
router.post('/logout', controller.jwtAuth, controller.requestAccessToken, controller.logout)
module.exports = router
