import { create } from "./lib/account";

const account = create({
  baseURL: "http://localhost:5777",
  onTokenExpire: () => {
    window.location.href = "/";
    console.log("token expired");
  },
});

export default account;
