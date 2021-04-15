const Router = require('koa-router')
const controller = require('./controller')
const errorHandler = require('./errorHandler')
const { validateRequestBody, validateRequestQuery } = require('../util/middlewares')
const router = new Router()

router.use(errorHandler.hexoInitiating)

router.post('/generate', validateRequestBody(controller.v.generate), controller.generate)
router.post('/deploy', validateRequestBody(controller.v.deploy), controller.deploy)
router.post('/clean', controller.clean)

router.get('/posts', controller.listPost)
router.get('/pages', controller.listPage)
router.get('/tags', controller.listTag)
router.get('/categories', controller.listCategory)

router.post('/new', validateRequestBody(controller.v.new), errorHandler.notFound, controller.new)
router.post('/update', validateRequestBody(controller.v.update), errorHandler.notFound, controller.update)
router.post('/delete', validateRequestBody(controller.v.delete), errorHandler.notFound, controller.delete)
router.post('/publish', validateRequestBody(controller.v.publish), errorHandler.notFound, controller.publish)

router.post('/git/sync', controller.notGitRepo, controller.gitSync)
router.post('/git/save', controller.notGitRepo, controller.gitSave)

router.get('/search', validateRequestQuery(controller.qv.search), controller.search)

module.exports = router
