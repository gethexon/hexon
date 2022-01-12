import compose from "koa-compose"
import { errorHandler } from "./controller"
import router from "./router"

export {
  createTokenAuthMiddleWare,
  createBasicAuthMiddleWare,
} from "./controller"

export default compose([errorHandler, router.routes(), router.allowedMethods()])
