import * as jwt from "jsonwebtoken";
import { inject, injectable, singleton } from "tsyringe";
import { createErrorReporter } from "../utils";
import { IStorageService, StorageServiceIdentifier } from "./storage";
const error = createErrorReporter("TokenService");
export const TOKEN_KEY: string = "base-tokens-expired";

export interface ITokenPayload {
  type: tokenType;
  //token expireAt 精确到一秒，random 用来避免同一秒内创建多个 token 导致测试失败
  random: string;
}

export interface ITokenInfo {
  access: string;
  refresh: string;
}

export interface ITokenTimingPayload {
  iat: number;
  exp: number;
}

export interface ISecurity {
  expire: string;
  refresh: string;
  secret: string;
}

export type tokenType = "access" | "refresh";

export interface ITokenService {
  verifyToken(token: string, type?: tokenType): void;
  getTokens<T>(payload: T): ITokenInfo;
  refreshTokens(token: string): ITokenInfo;
  expireToken(refreshToken: string): void;
  getTokenType(token: string): tokenType;
  getPayload<T>(token: string): T & ITokenPayload;
}

const defaultSecurity: ISecurity = {
  expire: "1h",
  refresh: "7d",
  secret: "secret",
};

@injectable()
@singleton()
export class TokenService implements ITokenService {
  private _security: ISecurity = defaultSecurity;
  constructor(
    @inject(StorageServiceIdentifier) private _storage: IStorageService
  ) {}

  public setSecurity(security: ISecurity) {
    this._security = security;
  }

  private sign<T>(payload: T, type: tokenType) {
    return jwt.sign(
      { ...payload, random: Math.random().toString(), type } as T &
        ITokenPayload,
      this._security.secret,
      {
        expiresIn:
          type === "access" ? this._security.expire : this._security.refresh,
      }
    );
  }

  public verifyToken<T>(token: string, type?: tokenType) {
    if (type) {
      const decoded = jwt.decode(token) as T & ITokenPayload;
      if (decoded.type !== type) error(`require ${type} token`);
    }
    jwt.verify(token, this._security.secret);
    const tokens = this._storage.get<string[]>(TOKEN_KEY) || [];
    if (tokens.find((t) => t === token)) error("token expired");
  }

  public getTokenType(token: string) {
    const decoded = jwt.decode(token) as ITokenPayload;
    return decoded.type;
  }

  public getPayload<T>(token: string) {
    return jwt.decode(token) as T & ITokenPayload;
  }

  public getTokens<T>(payload: T) {
    const access = this.sign(payload, "access");
    const refresh = this.sign(payload, "refresh");
    return { access, refresh };
  }

  public refreshTokens<T>(token: string) {
    this.verifyToken(token, "refresh");
    const payload = jwt.decode(token) as T &
      ITokenPayload &
      ITokenTimingPayload;
    delete payload.type;
    delete payload.random;
    delete payload.exp;
    delete payload.iat;
    const access = this.sign(payload as T & ITokenPayload, "access");
    const refresh = this.sign(payload as T & ITokenPayload, "refresh");
    this.expireToken(token);
    return { access, refresh };
  }

  public expireToken(refreshToken: string) {
    this.verifyToken(refreshToken, "refresh");
    const tokens = this._storage.get<string[]>(TOKEN_KEY) || [];
    tokens.push(refreshToken);
    this._storage.set<string[]>(TOKEN_KEY, tokens);
  }
}

export const TokenServiceIdentifier = "TokenService";
