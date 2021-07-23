import DI from "../util/di.js";
import AuthConfig from "./config.ts";
import { IConfigService, genDescriptor } from "../base/configService.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cryptoJs from "crypto-js";
import { IStorageService } from "../base/storageService.js";
import { ILogService } from "../base/logService.js";
const configService = DI.inject(IConfigService);
// defalut username is admin
configService.register(
  AuthConfig.AUTH_USERNAME,
  genDescriptor("admin", "string")
);
// default password is admin SHA1(SHA1('admin').toString()).toString()
configService.register(
  AuthConfig.AUTH_PASSWORD,
  genDescriptor("7b2e9f54cdff413fcde01f330af6896c3cd7e6cd", "string")
);
configService.register(
  AuthConfig.AUTH_SECRET,
  genDescriptor("secret", "string")
);
configService.register(AuthConfig.AUTH_EXPIRE, genDescriptor("1h", "string"));
configService.register(AuthConfig.AUTH_REFRESH, genDescriptor("7d", "string"));
const { SHA1 } = cryptoJs;
class AuthService {
  constructor() {
    this._configService = DI.inject(IConfigService);
    this._storageService = DI.inject(IStorageService);
    this._logger = DI.inject(ILogService).get("auth");
  }
  basicAuth(username, password) {
    if (username !== this._configService.get(AuthConfig.AUTH_USERNAME))
      return false;
    else if (
      SHA1(password).toString() !==
      this._configService.get(AuthConfig.AUTH_PASSWORD)
    )
      return false;
    this._logger.info("basic auth pass");
    return true;
  }
  getToken() {
    const uuid = uuidv4();
    const secret = this._configService.get(AuthConfig.AUTH_SECRET);
    const expire = this._configService.get(AuthConfig.AUTH_EXPIRE);
    const refresh = this._configService.get(AuthConfig.AUTH_REFRESH);
    const accessToken = jwt.sign({ type: "access", uuid }, secret, {
      expiresIn: expire,
    });
    const refreshToken = jwt.sign({ type: "refresh", uuid }, secret, {
      expiresIn: refresh,
    });
    const refreshTokens = this._storageService.get("refresh") || {};
    refreshTokens[uuid] = refreshToken;
    this._storageService.set("refresh", refreshTokens);
    return { accessToken, refreshToken };
  }
  verifyToken(token) {
    const res = jwt.verify(
      token,
      this._configService.get(AuthConfig.AUTH_SECRET)
    );
    this._logger.debug("jwt auth pass");
    return res;
  }
  getUserInfo() {
    return {
      name: this._configService.get(AuthConfig.AUTH_USERNAME),
    };
  }
  setSecurity({ secret, expire, refresh, username, password } = {}) {
    secret && this._configService.set(AuthConfig.AUTH_SECRET, secret);
    expire && this._configService.set(AuthConfig.AUTH_EXPIRE, expire);
    refresh && this._configService.set(AuthConfig.AUTH_REFRESH, refresh);
    username && this._configService.set(AuthConfig.AUTH_USERNAME, username);
    password &&
      this._configService.set(
        AuthConfig.AUTH_PASSWORD,
        SHA1(password).toString()
      );
  }
}
const IAuthService = "IAuthService";
DI.provide(IAuthService, AuthService);
export { IAuthService };
