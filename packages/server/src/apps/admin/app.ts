import Koa from "koa";
import path from "path";
import UserService from "./routes/signflow";
import mount from "koa-mount";
import statics from "winwin-statics";

const app = new Koa();
app.use(
  mount("/", statics(path.resolve(__dirname, "../../../../web/dist/pwa")))
);
app.use(UserService.routes());
app.use(UserService.allowedMethods());
export default app;
