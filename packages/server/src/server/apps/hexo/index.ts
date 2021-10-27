import Koa from "koa";
import { container } from "tsyringe";
import chalk from "chalk";
import { StorageService } from "~/shared/storage-service";
import account from "~/server/account";
import { HEXO_BASE_DIR_KEY } from "~/shared/constants";
import Hexo from "./service";
import router from "./router";

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
      process.exit(1);
    });

const app = new Koa();

app.use(account.auth());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
