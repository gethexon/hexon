import { createAccount } from "@winwin/vue-simple-account";
import { forceReloadWindow } from "./utils";

export default createAccount({
  baseURL: "http://localhost:5777",
  onTokenExpire: () => {
    console.log("token expired");
    forceReloadWindow();
  },
});
