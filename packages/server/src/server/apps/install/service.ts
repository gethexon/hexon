import { inject, injectable, singleton } from "tsyringe"
import { AccountService } from "~/shared/account-storage-service"
import { IStorageService, StorageService } from "~/shared/storage-service"
import { AuthStorageService } from "../account/auth-storage-service"

export interface IInstallOption {
  username: string
  password: string
  secret: string
  expiresIn: string
  refreshableIn: string
}
export interface IInstallService {
  isInstalled: () => boolean
  install: (options: IInstallOption) => Promise<void>
}
@injectable()
@singleton()
export class InstallService implements IInstallService {
  public static KEY = "hexon-installed"
  constructor(
    @inject(StorageService) private _storage: IStorageService,
    @inject(AccountService) private _account: AccountService,
    @inject(AuthStorageService) private _auth: AuthStorageService
  ) {
    if (!this._storage.get<boolean>(InstallService.KEY))
      this._storage.set<boolean>(InstallService.KEY, false)
  }
  isInstalled() {
    return this._storage.get<boolean>(InstallService.KEY)
  }
  async install(options: IInstallOption) {
    const { username, password, ...auth } = options
    this._account.setUserInfo(username, password)
    this._auth.setAuthInfo(auth)
    this._storage.set<boolean>(InstallService.KEY, true)
  }
}
