import type { IUserInfoWithPwd } from "./storage"

export const KEYS = {
  install: "install",
  user: "user",
  auth: "auth",
  blocklist: "blocklist",
}

export const defaultUserInfo: IUserInfoWithPwd = {
  username: "admin",
  password: "admin",
}
