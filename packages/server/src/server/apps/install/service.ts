import { inject, injectable, singleton } from "tsyringe"
import account from "~/server/account"
import { HEXON_ISINSTALL_KEY } from "~/shared/constants"
import { IStorageService, StorageService } from "~/shared/storage-service"

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
  constructor(@inject(StorageService) private _storage: IStorageService) {
    if (!this._storage.get<boolean>(HEXON_ISINSTALL_KEY))
      this._storage.set<boolean>(HEXON_ISINSTALL_KEY, false)
  }
  isInstalled() {
    return this._storage.get<boolean>(HEXON_ISINSTALL_KEY)
  }
  async install(options: IInstallOption) {
    const { username, password, ...auth } = options
    account.setUserInfo({ username, password })
    account.setAuthInfo(auth)
    this._storage.set<boolean>(HEXON_ISINSTALL_KEY, true)
  }
}
