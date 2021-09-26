import path from "path";
import { createSimpleAccount } from "@winwin/koa-simple-account";

const account = createSimpleAccount({
  path: path.resolve(__dirname, "../data/account.db"),
  secret: "secret",
  expiresIn: "10min",
  refreshableIn: "7d",
});

export default account;
