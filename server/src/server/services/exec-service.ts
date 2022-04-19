import { inject, injectable, singleton } from "tsyringe"
import { LogService } from "@/services/log-service"
import { StorageService } from "~/shared/storage-service"
import { execaCommand } from "execa"
import { HexoInstanceService } from "./hexo-instance-service"
import { toRealPath } from "~/shared/utils"

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
    return this._storage.get<string>(HexoInstanceService.HEXO_BASE_DIR_KEY)
  }

  public async run(command: string) {
    if (!command) return
    const cwd = toRealPath(this._getCwd())
    return execaCommand(command, { cwd, stdio: "inherit" })
  }
}
