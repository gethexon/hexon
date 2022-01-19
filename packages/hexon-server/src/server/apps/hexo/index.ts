import Koa from "koa"
import { createTokenAuthMiddleWare } from "../account"
import router from "../../routers/hexo-router"

const app = new Koa()

app.use(createTokenAuthMiddleWare())
app.use(router.routes())
app.use(router.allowedMethods())

export default app
