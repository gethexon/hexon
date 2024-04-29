import { SHA1 } from "crypto-js"
import { inject, injectable, singleton } from "tsyringe"
import { StorageService } from "./storage-service"
import { LogService } from "./log-service"

interface IUserInfo {
  password: string
  username: string
}

export class BasicAuthError extends Error {
  public name = "BasicAuthError"
}

@injectable()
@singleton()
export class AccountService {
  public static KEY = "userinfo" as const
  constructor(
    @inject(StorageService) private _storage: StorageService,
    @inject(LogService) private _logService: LogService
  ) {
    this._logService.setScope("account-service")
  }
  private _encrypt(raw: string) {
    return SHA1(raw).toString()
  }
  private _toStorage(info: IUserInfo) {
    this._storage.set(AccountService.KEY, info)
  }
  private _fromStorage(): IUserInfo {
    const { username = "", password = "" } =
      this._storage.get<IUserInfo>(AccountService.KEY) || {}
    return { username, password }
  }
  setUserInfo(username: string, password: string) {
    this._storage.set(AccountService.KEY, {
      username,
      password: this._encrypt(password),
    })
  }
  getUsername() {
    return this._fromStorage().username
  }
  setUsername(username: string) {
    const info = this._fromStorage()
    info.username = username
    this._toStorage(info)
  }
  setPassword(password: string) {
    const info = this._fromStorage()
    info.password = this._encrypt(password)
    this._toStorage(info)
  }
  setEncrptedPassword(password: string) {
    const info = this._fromStorage()
    info.password = password
    this._toStorage(info)
  }
  verify(username: string, password: string) {
    const info = this._fromStorage()
    if (username !== info.username) {
      return false
    }
    if (this._encrypt(password) !== info.password) {
      return false
    }
    return true
  }
}
