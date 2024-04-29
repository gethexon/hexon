import { inject, injectable, singleton } from "tsyringe"
import HexoCore from "hexo"
import path from "path"
import { LogService } from "@server-shared/log-service"
import { IStorageService, StorageService } from "@server-shared/storage-service"
import { isBlog, toRealPath } from "@server-shared/utils"
import { DEV } from "../utils"
import { HexoInitError } from "../errors"
import { HEXO_BASE_DIR_KEY, HEXO_OPTIONS_KEY } from "@server-shared/constants"


@injectable()
@singleton()
export class HexoInstanceService {
  static INITING = false
  static PENDING_COUNT = 0
  static RETRY_INTERVAL = 1000
  static MAX_RETRY = 2
  static CURRENT_RETRY = 0
  static TO_BE_CLEANED = 0

  private _options: HexoCore.InstanceOptions | null = null
  private _base: string | null = null
  private _hexo: HexoCore | null = null
  private _ready = false
  private _promise: any | null = null

  constructor(
    @inject(LogService) private _logService: LogService,
    @inject(StorageService) private _storageService: IStorageService
  ) {
    this._logService.setScope("hexo-instance-service")
  }

  private _withOptionsOverrides(options: HexoCore.InstanceOptions) {
    return { ...options, draft: true, drafts: true }
  }

  private _setHexoBase() {
    const base = this._storageService.get<string>(HEXO_BASE_DIR_KEY)
    const base_dir = path.resolve(__dirname, toRealPath(base))
    if (!isBlog(base_dir))
      throw new Error(`"${base_dir}" is not a hexo blog folder`)
    this._base = base_dir
  }

  private _setOptions() {
    this._options =
      this._storageService.get<HexoCore.InstanceOptions>(HEXO_OPTIONS_KEY) || {}
    this._options.silent = DEV ? false : this._options.silent
  }

  private _createHexoInstance() {
    if (!this._base) throw new Error("please set hexo root first")
    this._hexo = new HexoCore(
      this._base,
      this._withOptionsOverrides(this._options!)
    )
  }

  private async _init(): Promise<void> {
    this._logService.log("real init start")
    this._ready = false
    await this._setHexoBase()
    await this._setOptions()
    await this._createHexoInstance()
    await this._hexo!.init()
    await this._hexo!.watch()
    this._ready = true
    this._logService.log("real init finished")
  }

  async setOptions(options: HexoCore.InstanceOptions) {
    this._storageService.set<HexoCore.InstanceOptions>(
      HEXO_OPTIONS_KEY,
      options
    )
    this._logService.log("options set")
  }

  async _tryInit(count = HexoInstanceService.MAX_RETRY) {
    try {
      await this._init()
      HexoInstanceService.INITING = false
    } catch (err) {
      this._logService.error(err)
      this._logService.error(`error when init hexo instance. `)
      this._logService.error(
        `retry in ${HexoInstanceService.RETRY_INTERVAL} ms.`,
        `${count} retry left`
      )
      if (count)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this._tryInit(count - 1))
          }, HexoInstanceService.RETRY_INTERVAL)
        })
      else {
        HexoInstanceService.INITING = false
        // String(err) 用于向客户端显示详细报错信息
        throw new HexoInitError(String(err))
      }
    }
  }

  async init(): Promise<void> {
    if (!HexoInstanceService.INITING) this._promise = this._tryInit()
    return this._promise
  }

  async getBaseDir() {
    if (!this._ready) await this.init()
    return this._base!
  }

  async getInstance() {
    if (!this._ready) await this.init()
    this._logService.log("instance required")
    return this._hexo!
  }

  async getInstanceWithOriginOptions(
    genOptions: (
      options: HexoCore.InstanceOptions
    ) => HexoCore.InstanceOptions = (o) => o
  ) {
    if (!this._ready) await this.init()
    const newOptions = genOptions(this._options!)
    const hexo = new HexoCore(this._base!, newOptions)
    await hexo.init()
    await hexo.watch()
    HexoInstanceService.TO_BE_CLEANED++
    this._logService.log("instance with options required")
    this._logService.log(
      `${HexoInstanceService.TO_BE_CLEANED} extra instance to be cleaned`
    )
    const cleanup = async () => {
      await hexo.unwatch()
      HexoInstanceService.TO_BE_CLEANED--
      this._logService.log("instance with options cleaned")
      if (HexoInstanceService.TO_BE_CLEANED === 0) {
        this._logService.log("all instances have been cleaned")
      } else {
        this._logService.log(
          `${HexoInstanceService.TO_BE_CLEANED} extra instance to be cleaned`
        )
      }
    }
    return { hexo, cleanup }
  }

  async runBetweenReload<T>(fn: () => T | Promise<T>): Promise<T> {
    if (!this._ready) await this.init()
    const unload = async () => {
      await this._hexo!.unwatch()
    }
    const load = async () => {
      await this._hexo!.watch()
      HexoInstanceService.INITING = false
    }
    const markHexoInitError = (err: any) => {
      this._ready = false
      HexoInstanceService.INITING = false
    }
    HexoInstanceService.INITING = true
    await unload().catch(markHexoInitError)
    const res = await Promise.resolve(fn())
    await load().catch(markHexoInitError)
    return res
  }
}
