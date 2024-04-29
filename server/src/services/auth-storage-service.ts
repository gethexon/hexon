import { inject, injectable, singleton } from "tsyringe"
import { LogService } from "@server-shared/log-service"
import { StorageService } from "@server-shared/storage-service"

interface IAuthInfo {
  secret: string
  expiresIn: string
  refreshableIn: string
}

@injectable()
@singleton()
export class AuthStorageService {
  public static KEY = "authinfo"
  constructor(
    @inject(StorageService) private _storage: StorageService,
    @inject(LogService) private _logService: LogService
  ) {
    this._logService.setScope("auth-storage-service")
  }

  private _toStorage(info: IAuthInfo) {
    this._storage.set(AuthStorageService.KEY, info)
  }

  private _fromStorage(): IAuthInfo {
    const {
      secret = "secret",
      expiresIn = "1h",
      refreshableIn = "7d",
    } = this._storage.get<IAuthInfo>(AuthStorageService.KEY) || {}
    return { secret, expiresIn, refreshableIn }
  }

  public setAuthInfo(info: IAuthInfo) {
    this._toStorage(info)
    this._logService.log(`set auth info`)
  }

  public getSecret() {
    const s = this._fromStorage().secret
    this._logService.log(`get secret`)
    return s
  }

  public getAuthInfo(): IAuthInfo {
    const s = this._fromStorage()
    this._logService.log(`get auth info`)
    return s
  }
}
