import { inject, injectable, singleton } from "tsyringe"
import { LogService } from "@server-shared/log-service"
import { StorageService } from "@server-shared/storage-service"
import { execaCommand } from "execa"
import { toRealPath } from "@server-shared/utils"
import { HEXO_BASE_DIR_KEY } from "@server-shared/constants"

@injectable()
@singleton()
export class ExecService {
  constructor(
    @inject(StorageService) private _storage: StorageService,
    @inject(LogService) private _logService: LogService
  ) {
    this._logService.setScope("exec-service")
  }

  private _getCwd() {
    return this._storage.get<string>(HEXO_BASE_DIR_KEY)
  }

  public async run(command: string) {
    if (!command) return
    const cwd = toRealPath(this._getCwd())
    return execaCommand(command, { cwd, stdio: "inherit" })
  }
}
