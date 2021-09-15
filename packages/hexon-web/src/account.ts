import { create } from "./lib/account";
import { forceReloadWindow } from "./utils";

const account = create({
  baseURL: "http://localhost:5777",
  onTokenExpire: () => {
    console.log("token expired");
    forceReloadWindow();
  },
});

export default account;
