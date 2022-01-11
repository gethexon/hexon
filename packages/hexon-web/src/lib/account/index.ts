import { App, InjectionKey, inject, ref, computed, ComputedRef } from "vue"
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

interface IConfig {
  baseURL: string
  authBaseURL?: string
  onTokenExpire: () => void
  prefix?: string
  getAxiosInstance?: (config?: AxiosRequestConfig) => AxiosInstance
  injectionKey?: string
}
interface IUserInfo {
  username: string
}
interface IPassword {
  password: string
}
interface ITokens {
  accessToken: string
  refreshToken: string
}

const accountProviderInjectionKey: InjectionKey<IAccount> = Symbol("account")

class AccountStorage {
  private ACCESS_TOKEN_KEY: string
  private REFRESH_TOKEN_KEY: string

  constructor(prefix: string = "") {
    this.ACCESS_TOKEN_KEY = `${prefix}access-token`
    this.REFRESH_TOKEN_KEY = `${prefix}refresh-token`
  }
  setAccessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token)
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token)
  }

  getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || ""
  }

  getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || ""
  }

  destory() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  hasToken() {
    return this.getAccessToken() && this.getRefreshToken()
  }
}
export interface IAccount {
  readonly defaults: {
    baseURL: string
    headers: {
      ["Content-Type"]: "application/json"
    }
  }
  readonly isSignedIn: boolean
  origin: AxiosInstance
  access: AxiosInstance
  refresh: AxiosInstance
  user: ComputedRef<IUserInfo | undefined>
  signin(username: string, password: string): Promise<void>
  info(): Promise<IUserInfo>
  signout(): Promise<void>
  changePassword(
    oldPassword: string,
    info?: Partial<IUserInfo & IPassword>
  ): Promise<void>
  changeUsername(username: string): Promise<void>
  install(app: App): void
}

export function createAccount(config: IConfig): IAccount {
  //#region parse config
  const baseURL = config.baseURL
  const authBaseURL = config.authBaseURL || ""
  const onTokenExpire = config.onTokenExpire
  const storage = new AccountStorage(config.prefix)
  const getAxiosInstance =
    config.getAxiosInstance ?? ((config) => axios.create(config))
  const injectionKey = config.injectionKey || accountProviderInjectionKey
  //#endregion

  //#region setup axios
  const defaults: IAccount["defaults"] = {
    baseURL: baseURL,
    headers: {
      ["Content-Type"]: "application/json",
    },
  }
  const withAuthBase = (url: string) => `${authBaseURL}${url}`
  const origin = getAxiosInstance(defaults)
  const access = getAxiosInstance(defaults)
  const refresh = getAxiosInstance(defaults)
  access.interceptors.request.use((config) => {
    const token = storage.getAccessToken()
    token && (config.headers.Authorization = "Bearer " + token)
    return config
  })
  access.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && err.response.status === 401) {
        return refresh.post(withAuthBase("/refresh")).then((res) => {
          const data = res.data as ITokens
          storage.setAccessToken(data.accessToken)
          storage.setRefreshToken(data.refreshToken)
          return access(err.config)
        })
      } else return Promise.reject(err)
    }
  )
  refresh.interceptors.request.use((config) => {
    const token = storage.getRefreshToken()
    token && (config.headers.Authorization = "Bearer " + token)
    return config
  })
  refresh.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response && err.response.status === 401) {
        storage.destory()
        onTokenExpire()
      } else throw err
    }
  )
  //#endregion

  //#region login logout
  const user = ref<IUserInfo>()
  async function signin(username: string, password: string) {
    const res = await origin.post(withAuthBase("/signin"), {
      username,
      password,
    })
    const data = res.data as ITokens
    storage.setAccessToken(data.accessToken)
    storage.setRefreshToken(data.refreshToken)
    await info()
  }
  async function info() {
    return await access.get(withAuthBase("/info")).then((res) => {
      user.value = res.data
      return res.data
    })
  }
  async function signout() {
    await refresh.post(withAuthBase("/signout"), {
      access: storage.getAccessToken(),
    })
    storage.destory()
  }
  async function changePassword(oldPassword: string, { password }: IPassword) {
    await access.put("/info/password", {
      oldPassword,
      password,
    })
  }
  async function changeUsername(username: string) {
    await access.put("/info/username", { username })
  }
  //#endregion
  return {
    get defaults() {
      return defaults
    },
    get isSignedIn() {
      return !!storage.getAccessToken() && !!storage.getRefreshToken()
    },
    origin,
    access,
    refresh,
    user: computed(() => user.value),
    signin,
    info,
    signout,
    changePassword,
    changeUsername,
    install(app: App) {
      const account = this
      app.provide(injectionKey, account)
    },
  }
}

export function useAccount(key: InjectionKey<IAccount> | string | null = null) {
  return inject(key || accountProviderInjectionKey)!
}
