import { inject, injectable, singleton } from "tsyringe"
import { AccountService } from "./account-storage-service"
import { StorageService } from "./storage-service"
import { HEXON_PORT_KEY } from "./constants"
import { HexoInstanceService } from "~/server/services/hexo-instance-service"

@injectable()
@singleton()
export class EnvService {
  constructor(
    @inject(StorageService) private storage: StorageService,
    @inject(AccountService) private account: AccountService
  ) {}

  sync() {
    this.syncAccount()
    this.syncHexon()
    this.syncHexo()
  }

  private syncAccount() {
    const username = process.env.USERNAME
    const password = process.env.PASSWORD
    username && this.account.setUsername(username)
    password && this.account.setPassword(password)
    console.log({ username, password })
  }

  private syncHexon() {
    const port = process.env.HEXON_PORT
    port && this.storage.set(HEXON_PORT_KEY, port)
    console.log({ port })
  }

  private syncHexo() {
    const base = process.env.HEXO_BASE
    base && this.storage.set(HexoInstanceService.HEXO_BASE_DIR_KEY, base)
    console.log({ base })
  }
}
