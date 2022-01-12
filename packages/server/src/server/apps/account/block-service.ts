import { inject, injectable, singleton } from "tsyringe"
import { StorageService } from "~/shared/storage-service"

type BlockInfo = string[]

@injectable()
@singleton()
export class BlockService {
  public static KEY = "blocklist"
  constructor(@inject(StorageService) private _storage: StorageService) {}

  private _toStorage(info: BlockInfo) {
    this._storage.set(BlockService.KEY, info)
  }
  private _fromStorage(): BlockInfo {
    return this._storage.get(BlockService.KEY) || []
  }

  isBlocked(token: string) {
    return this._fromStorage().includes(token)
  }

  block(tokens: string[]) {
    const blocked = this._fromStorage()
    blocked.push(...tokens)
    this._toStorage(blocked)
  }

  clear() {
    this._toStorage([])
  }
}
