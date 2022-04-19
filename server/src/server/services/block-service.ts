import { inject, injectable, singleton } from "tsyringe"
import { LogService } from "@/services/log-service"
import { StorageService } from "~/shared/storage-service"

type BlockInfo = string[]

@injectable()
@singleton()
export class BlockService {
  public static KEY = "blocklist"
  constructor(
    @inject(StorageService) private _storage: StorageService,
    @inject(LogService) private _logService: LogService
  ) {
    this._logService.setScope("block-service")
  }

  private _toStorage(info: BlockInfo) {
    this._storage.set(BlockService.KEY, info)
  }
  private _fromStorage(): BlockInfo {
    return this._storage.get(BlockService.KEY) || []
  }

  isBlocked(token: string) {
    this._logService.log("query token")
    return this._fromStorage().includes(token)
  }

  block(tokens: string[]) {
    const blocked = this._fromStorage()
    blocked.push(...tokens)
    this._toStorage(blocked)
    this._logService.log("block tokens", tokens.length)
  }

  clear() {
    this._toStorage([])
    // FIXME 按照过期时间清理
    this._logService.log("clear block")
  }
}
