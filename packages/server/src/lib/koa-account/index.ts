import path from "path";
import fs from "fs";
import { Middleware } from "koa";
import compose from "koa-compose";
import JsonDB from "simple-json-db";
import { defaultUserInfo } from "./constants";
import {
  setUserInfo,
  installed,
  setDB,
  setAuthInfo,
  IAuthInfo,
  setInstalled,
} from "./storage";
import router from "./router";
import { errorHandler } from "./error";
import { debug } from "./utils";

export { IUserInfo } from "./storage";
export { auth } from "./auth";

interface IConfig {
  path: string;
  secret: string;
  expiresIn: string;
  refreshableIn: string;
  base?: string;
}
const initialize = async (config: IConfig) => {
  // db file
  const dirname = path.dirname(config.path);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
    debug(`create database: ${dirname}`);
  }
  // db object
  setDB(new JsonDB(config.path));
  if (!installed()) {
    setUserInfo(defaultUserInfo);
    setInstalled();
    debug(`first install: set defualt userinfo`);
  }
  const authInfo: IAuthInfo = {
    secret: config.secret,
    expiresIn: config.expiresIn,
    refreshableIn: config.refreshableIn,
  };
  setAuthInfo(authInfo);
  router.prefix(config.base || "");
};

export default (config: IConfig): Middleware => {
  initialize(config);
  return compose([errorHandler, router.routes(), router.allowedMethods()]);
};
