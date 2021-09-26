import Koa from "koa";
import Hexo from "./service";
import { container } from "tsyringe";
import chalk from "chalk";
import { StorageService } from "../../services/storage";
import { HEXO_BASE_DIR_KEY } from "./constants";
import router from "./router";
import account from "../../account";

const storage = container.resolve(StorageService);
const hexo = container.resolve(Hexo);

if (storage.get(HEXO_BASE_DIR_KEY))
  hexo
    .init()
    .then(async () => {
      // This line for test only
    })
    .catch((err) => {
      console.log(chalk.red("Fail to initialize hexo, waiting for retry:"));
      console.log(chalk.red(err.message));
    });

const app = new Koa();

app.use(account.auth());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
