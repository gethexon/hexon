import { IInternalUserInfo } from "./storage";

export const KEYS = {
  installFlag: "installed",
  user: "user",
  auth: "auth",
  blocklist: "blocklist",
};

export const defaultUserInfo: IInternalUserInfo = {
  username: "admin",
  password: "admin",
};
