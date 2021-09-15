import axios, { AxiosInstance } from "axios";
import {
  destory,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./storage";
export interface IConfig {
  baseURL: string;
  authBaseURL?: string;
  onTokenExpire: () => void;
}
export interface IUserInfo {
  username: string;
}
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
export interface IAccount {
  http: {
    origin: AxiosInstance;
    access: AxiosInstance;
    refresh: AxiosInstance;
  };
  service: {
    signin: (username: string, password: string) => Promise<ITokens>;
    signout: () => void;
    info: () => Promise<IUserInfo>;
  };
}
export const create = (config: IConfig): IAccount => {
  const baseURL = config.baseURL;
  const authBaseURL = config.authBaseURL || "";
  const onTokenExpire = config.onTokenExpire;
  const withAuthBase = (url: string) => `${authBaseURL}${url}`;
  const defaults = {
    baseURL: baseURL,
    headers: {
      ["Content-Type"]: "application/json",
    },
  };
  const origin = axios.create(defaults);

  const access = axios.create(defaults);
  access.interceptors.request.use((config) => {
    const token = getAccessToken();
    token && (config.headers.Authorization = "Bearer " + token);
    return config;
  });
  access.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && err.response.status === 401) {
        return refresh.post(withAuthBase("/refresh")).then((res) => {
          const data = res.data as ITokens;
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          return access(err.config);
        });
      } else return Promise.reject(err);
    }
  );

  const refresh = axios.create(defaults);
  refresh.interceptors.request.use((config) => {
    const token = getRefreshToken();
    token && (config.headers.Authorization = "Bearer " + token);
    return config;
  });
  refresh.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && err.response.status === 401) {
        destory();
        onTokenExpire();
      } else throw err;
    }
  );

  const service = {
    signin: async (username: string, password: string) => {
      const res = await origin.post(withAuthBase("/signin"), undefined, {
        auth: {
          username,
          password,
        },
      });
      const data = res.data as ITokens;
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return res.data;
    },
    signout: async () => {
      await refresh.post(withAuthBase("/signout"), {
        access: getAccessToken(),
      });
      destory();
    },
    info: async () => {
      return access
        .get(withAuthBase("/refresh"))
        .then((res) => res.data as IUserInfo);
    },
    changeInfo: async (info: { username?: string; password?: string } = {}) => {
      await access.put("/info", info);
    },
  };

  return { http: { origin, access, refresh }, service };
};
export const isSignedIn = (): boolean => {
  return !!getAccessToken() && !!getRefreshToken();
};
