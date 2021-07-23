import Koa from "koa";
import path from "path";
import mount from "koa-mount";
import UserService from "./routes/signflow";
import statics from "../../middlewares/statics";

const app = new Koa();
app.use(
  mount("/", statics(path.resolve(__dirname, "../../../../web/dist/pwa")))
);
app.use(UserService.routes());
app.use(UserService.allowedMethods());
export default app;
