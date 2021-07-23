import { inject, injectable, singleton } from "tsyringe";
import { SHA1 } from "crypto-js";
import { createErrorReporter } from "../../../utils";
import {
  ITokenInfo,
  ITokenService,
  TokenServiceIdentifier,
} from "../../../services/token";
import {
  IStorageService,
  StorageServiceIdentifier,
} from "../../../services/storage";

const error = createErrorReporter("UserService");

export const USERS_KEY: string = "admin-users";

export interface IUserService {
  signIn: (username: string, password: string) => IUserInfo & ITokenInfo;
  signUp: (username: string, password: string) => IUserInfo & ITokenInfo;
  signOff: (refreshToken: string) => void;
  getInfo: (accessToken: string) => IUserInfo;
  verify: (accessToken: string) => void;
  refresh: (refreshToken: string) => ITokenInfo;
}

export interface IUserInfo {
  username: string;
}

interface IInternalUserInfo extends IUserInfo {
  // TODO: 添加 id
  // id: string;
  password: string;
}

@injectable()
@singleton()
export class UserService implements IUserService {
  constructor(
    @inject(StorageServiceIdentifier) private _storage: IStorageService,
    @inject(TokenServiceIdentifier) private _tokenService: ITokenService
  ) {}

  private _getUsers(): IInternalUserInfo[] {
    return this._storage.get(USERS_KEY) || [];
  }

  private _getUser(username: string): IInternalUserInfo | undefined {
    const users = this._getUsers();
    return users.find((user) => user.username === username);
  }

  private _setUser(username: string, info: IUserInfo): IUserInfo {
    const users = this._getUsers();
    const old = this._getUser(username);
    users[users.indexOf(old)] = { ...old, ...info };
    return this.getUserInfo(username);
  }

  private getUserInfo(username: string): IUserInfo | undefined {
    const users = this._getUsers();
    const user = users.find((user) => user.username === username);
    const { password, ...rest } = user;
    return rest;
  }

  private addUser(username: string, password: string): void {
    // default password is admin SHA1('admin').toString()
    const users = this._getUsers();
    // TODO: use salt
    users.push({ username, password: SHA1(password).toString() });
    this._storage.set(USERS_KEY, users);
  }

  public signIn(username: string, password: string): IUserInfo & ITokenInfo {
    const user = this._getUser(username);
    if (!user) error("user not found");
    if (user.password !== SHA1(password).toString())
      error("wrong username or password");
    const tokens = this._tokenService.getTokens({ username });
    return { ...this.getUserInfo(username), ...tokens };
  }

  public signUp(username: string, password: string): IUserInfo & ITokenInfo {
    if (this._getUser(username)) error("user exists");
    this.addUser(username, password);
    const tokens = this._tokenService.getTokens({ username });
    return { ...this.getUserInfo(username), ...tokens };
  }

  public verify(accessToken: string): void {
    this._tokenService.verifyToken(accessToken, "access");
    const type = this._tokenService.getTokenType(accessToken);
    if (type !== "access") error("require access token");
  }

  public refresh(refreshToken: string): ITokenInfo {
    return this._tokenService.refreshTokens(refreshToken);
  }

  public signOff(refreshToken: string): void {
    this._tokenService.expireToken(refreshToken);
  }

  public getInfo(token: string): IUserInfo {
    this._tokenService.verifyToken(token, "access");
    const { username } = this._tokenService.getPayload(token);
    return this.getUserInfo(username);
  }

  public updateInfo(token: string, info: IUserInfo) {
    const { username } = this._tokenService.getPayload(token);
    return this._setUser(username, info);
  }
}
