import { IInternalUserInfo } from "./storage";

export const KEYS = {
  install: "install",
  user: "user",
  auth: "auth",
  blocklist: "blocklist",
};

export const defaultUserInfo: IInternalUserInfo = {
  username: "admin",
  password: "admin",
};
