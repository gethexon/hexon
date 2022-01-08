import Koa from "koa";
import account from "~/server/account";
import router from "./router";

const app = new Koa();

app.use(account.auth());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
