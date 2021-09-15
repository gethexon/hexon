import JsonDB from "simple-json-db";
import { KEYS } from "./constants";
export interface IUserInfo {
  username: string;
}
export interface IInternalUserInfo extends IUserInfo {
  password: string;
}
export interface IAuthInfo {
  secret: string;
  expiresIn: string;
  refreshableIn: string;
}
export interface IInstall {
  installed: boolean;
  time: number;
}

interface IInternals {
  db: JsonDB | null;
}
const internals: IInternals = {
  db: null,
};
export const setDB = (db: JsonDB) => {
  internals.db = db;
};
export const installed = () => {
  const install = internals.db.get(KEYS.install) as IInstall;
  return install?.installed;
};
export const getAuthInfo = (): IAuthInfo => {
  return internals.db.get(KEYS.auth) as IAuthInfo;
};
export const setAuthInfo = (authInfo: IAuthInfo) => {
  internals.db.set(KEYS.auth, authInfo);
};
export const setInstalled = () => {
  internals.db.set(KEYS.install, {
    installed: true,
    time: new Date().valueOf(),
  });
};
export const changeUsername = (username: string) => {
  const info = getUserInfo();
  info.username = username;
  setUserInfo(info);
};
export const changePassword = (password: string) => {
  const info = getUserInfo();
  info.password = password;
  setUserInfo(info);
};
export const getUserInfo = (): IInternalUserInfo => {
  return internals.db.get(KEYS.user) as IInternalUserInfo;
};
export const setUserInfo = (userInfo: IInternalUserInfo) => {
  internals.db.set(KEYS.user, userInfo);
};
const getblocklist = () => {
  return (internals.db.get(KEYS.blocklist) as string[]) || [];
};
export const isBlocked = (token: string) => {
  const blocklist = getblocklist();
  return blocklist.includes(token);
};
export const block = (tokens: string | string[]) => {
  if (!Array.isArray(tokens)) tokens = [tokens];
  const blocklist = getblocklist();
  tokens.forEach((token) => blocklist.push(token));
  internals.db.set(KEYS.blocklist, blocklist);
};
