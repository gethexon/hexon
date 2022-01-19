import { container } from "tsyringe"
import chalk from "chalk"
import Koa from "koa"
import { HEXO_BASE_DIR_KEY } from "~/shared/constants"
import { StorageService } from "~/shared/storage-service"
import { createTokenAuthMiddleWare } from "../account"
import router from "./router"
import Hexo from "./service"

const storage = container.resolve(StorageService)
const hexo = container.resolve(Hexo)

if (storage.get(HEXO_BASE_DIR_KEY))
  hexo
    .init()
    .then(async () => {
      // This line for test only
    })
    .catch((err) => {
      console.log(chalk.red("Fail to initialize hexo, waiting for retry:"))
      console.log(chalk.red(err.message))
      process.exit(1)
    })

const app = new Koa()

app.use(createTokenAuthMiddleWare())
app.use(router.routes())
app.use(router.allowedMethods())

export default app
