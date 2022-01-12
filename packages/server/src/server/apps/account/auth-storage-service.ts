import { inject, injectable, singleton } from "tsyringe"
import { StorageService } from "~/shared/storage-service"

interface IAuthInfo {
  secret: string
  expiresIn: string
  refreshableIn: string
}

@injectable()
@singleton()
export class AuthStorageService {
  public static KEY = "authinfo"
  constructor(@inject(StorageService) private _storage: StorageService) {}

  private _toStorage(info: IAuthInfo) {
    this._storage.set(AuthStorageService.KEY, info)
  }

  private _fromStorage(): IAuthInfo {
    const {
      secret = "secret",
      expiresIn = "1h",
      refreshableIn = "7d",
    } = this._storage.get(AuthStorageService.KEY) || {}
    return { secret, expiresIn, refreshableIn }
  }

  public setAuthInfo(info: IAuthInfo) {
    this._toStorage(info)
  }

  public getSecret() {
    return this._fromStorage().secret
  }

  public getAuthInfo(): IAuthInfo {
    return this._fromStorage()
  }
}
