import { App, InjectionKey, inject } from "vue";
import axios, { AxiosInstance } from "axios";
import { RouteLocationNormalized } from "vue-router";

interface IConfig {
  baseURL: string;
  authBaseURL?: string;
  onTokenExpire: () => void;
  prefix?: string;
}
interface IUserInfo {
  username: string;
}
interface ITokens {
  accessToken: string;
  refreshToken: string;
}

const accountProviderInjectionKey: InjectionKey<Account> = Symbol("account");

class AccountStorage {
  private ACCESS_TOKEN_KEY: string;
  private REFRESH_TOKEN_KEY: string;

  constructor(prefix: string = "") {
    this.ACCESS_TOKEN_KEY = `${prefix}access-token`;
    this.REFRESH_TOKEN_KEY = `${prefix}refresh-token`;
  }
  setAccessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || "";
  }

  getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || "";
  }

  destory() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  hasToken() {
    return this.getAccessToken() && this.getRefreshToken();
  }
}

class Account {
  private baseURL: string;
  private authBaseURL: string;
  private onTokenExpire: () => void;
  private storage: AccountStorage;

  public origin: AxiosInstance;
  public access: AxiosInstance;
  public refresh: AxiosInstance;

  constructor(config: IConfig) {
    this.baseURL = config.baseURL;
    this.authBaseURL = config.authBaseURL || "";
    this.onTokenExpire = config.onTokenExpire;
    this.storage = new AccountStorage(config.prefix);
    this.origin = axios.create(this.defaults);
    this.access = axios.create(this.defaults);
    this.setupAccess();
    this.refresh = axios.create(this.defaults);
    this.setupRequest();
  }
  install(vue: App, injectKey?: InjectionKey<Account> | string) {
    vue.provide(injectKey || accountProviderInjectionKey, this);
  }
  get defaults() {
    return {
      baseURL: this.baseURL,
      headers: {
        ["Content-Type"]: "application/json",
      },
    };
  }
  private withAuthBase(url: string) {
    return `${this.authBaseURL}${url}`;
  }
  private setupAccess() {
    this.access.interceptors.request.use((config) => {
      const token = this.storage.getAccessToken();
      token && (config.headers.Authorization = "Bearer " + token);
      return config;
    });
    this.access.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && err.response.status === 401) {
          return this.refresh
            .post(this.withAuthBase("/refresh"))
            .then((res) => {
              const data = res.data as ITokens;
              this.storage.setAccessToken(data.accessToken);
              this.storage.setRefreshToken(data.refreshToken);
              return this.access(err.config);
            });
        } else return Promise.reject(err);
      }
    );
  }
  private setupRequest() {
    this.refresh.interceptors.request.use((config) => {
      const token = this.storage.getRefreshToken();
      token && (config.headers.Authorization = "Bearer " + token);
      return config;
    });
    this.refresh.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && err.response.status === 401) {
          this.storage.destory();
          this.onTokenExpire();
        } else throw err;
      }
    );
  }
  get isSignedIn() {
    return !!this.storage.getAccessToken() && !!this.storage.getRefreshToken();
  }
  public async signin(username: string, password: string) {
    const res = await this.origin.post(
      this.withAuthBase("/signin"),
      undefined,
      {
        auth: {
          username,
          password,
        },
      }
    );
    const data = res.data as ITokens;
    this.storage.setAccessToken(data.accessToken);
    this.storage.setRefreshToken(data.refreshToken);
    return res.data;
  }
  public async signout() {
    await this.refresh.post(this.withAuthBase("/signout"), {
      access: this.storage.getAccessToken(),
    });
    this.storage.destory();
  }
  public async info() {
    return this.access
      .get(this.withAuthBase("/refresh"))
      .then((res) => res.data as IUserInfo);
  }
  public async changeInfo(info: { username?: string; password?: string } = {}) {
    await this.access.put("/info", info);
  }
  public beforeEachGuard(config: { home: string; signin: string }) {
    return (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
      if (from.path === "/" && to.path === config.home && this.isSignedIn) {
        return true;
      }
      if (to.path === config.signin) {
        if (this.isSignedIn) {
          return "/";
        } else return true;
      } else {
        if (!this.isSignedIn) {
          return config.signin;
        } else return true;
      }
    };
  }
}

export function createAccount(config: IConfig) {
  return new Account(config);
}

export function useAccount(key: InjectionKey<Account> | string | null = null) {
  return inject(key || accountProviderInjectionKey);
}
