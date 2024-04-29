import { inject, injectable, singleton } from "tsyringe"
import { AccountService } from "./account-storage-service"
import { StorageService } from "./storage-service"
import { HEXON_PORT_KEY, HEXO_BASE_DIR_KEY } from "./constants"
import { LogService } from "./log-service"

@injectable()
@singleton()
export class EnvService {
  constructor(
    @inject(StorageService) private storage: StorageService,
    @inject(AccountService) private account: AccountService,
    @inject(LogService) private _logService: LogService
  ) {
    this._logService.setScope("env-service")
  }

  sync() {
    this.syncAccount()
    this.syncHexon()
    this.syncHexo()
  }

  private syncAccount() {
    const username = process.env.USERNAME
    const password = process.env.PASSWORD
    if (username) {
      this._logService.log(`sync account from process.env.USERNAME`)
      this.account.setUsername(username)
    }
    if (password) {
      this._logService.log(`sync account from process.env.PASSWORD`)
      this.account.setPassword(password)
    }
  }

  private syncHexon() {
    const port = process.env.HEXON_PORT
    if (port) {
      this._logService.log(`sync hexon port from process.env.HEXON_PORT`)
      this.storage.set(HEXON_PORT_KEY, port)
    }
  }

  private syncHexo() {
    const base = process.env.HEXO_BASE
    if (base) {
      this._logService.log(`sync hexo base from process.env.HEXO_BASE`)
      this.storage.set(HEXO_BASE_DIR_KEY, base)
    }
  }
}
