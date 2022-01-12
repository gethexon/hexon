import Koa from "koa"
import router from "./router"
export { checkInstall } from "./controller"

const app = new Koa()

app.use(router.routes())
app.use(router.allowedMethods())

export default app
