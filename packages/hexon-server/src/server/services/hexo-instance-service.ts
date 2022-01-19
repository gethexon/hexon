import { default as HexoCore } from "hexo"
import { inject, injectable, singleton } from "tsyringe"
import path from "path"
import { IStorageService, StorageService } from "~/shared/storage-service"
import { isBlog, toRealPath } from "~/shared/utils"
import { DEV } from "../utils"
import { LogService } from "./log-service"

export class NotHexoBlogError extends Error {
  name = "NotHexoBlogError"
}
export class EmptyHexoBlogError extends Error {
  name = "EmptyHexoBlogError"
}

export class HexoCoreInitError extends Error {
  name = "HexoCoreInitError"
}
export class HexoCoreInitiatingError extends Error {
  name = "HexoCoreInitiatingError"
}

export class HexoInstanceNotCleanedError extends Error {
  name = "HexoInstanceNotCleanedError"
}

const HEXO_BASE_DIR_KEY = "hexo-basedir"
const HEXO_OPTIONS_KEY = "hexo-options"

@injectable()
@singleton()
export class HexoInstanceService {
  static INITING = false
  static RETRY_INTERVAL = 1000
  static MAX_RETRY = 2
  static CURRENT_RETRY = 0
  static TO_BE_CLEANED = 0
  static INIT_ERROR: HexoCoreInitError

  private _options: HexoCore.InstanceOptions | null = null
  private _base: string | null = null
  private _hexo: HexoCore | null = null
  private _ready = false

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
    if (!isBlog(base_dir)) throw new NotHexoBlogError()
    this._base = base_dir
  }

  private _setOptions() {
    this._options =
      this._storageService.get<HexoCore.InstanceOptions>(HEXO_OPTIONS_KEY) || {}
    this._options.silent = DEV ? false : this._options.silent
  }

  private _createHexoInstance() {
    if (!this._base) throw new EmptyHexoBlogError()
    this._hexo = new HexoCore(
      this._base,
      this._withOptionsOverrides(this._options)
    )
  }

  private async _init(): Promise<void> {
    this._logService.log("real init start")
    this._ready = false
    await this._setHexoBase()
    await this._setOptions()
    await this._createHexoInstance()
    await this._hexo.init()
    await this._hexo.watch()
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

  async init(retry = false): Promise<void> {
    if (!retry && HexoInstanceService.INITING) {
      throw new HexoCoreInitiatingError()
    }
    try {
      HexoInstanceService.CURRENT_RETRY++
      HexoInstanceService.INITING = true
      HexoInstanceService.INIT_ERROR = null
      await this._init()
      HexoInstanceService.CURRENT_RETRY = 0
      HexoInstanceService.INITING = false
    } catch (err) {
      this._logService.error(err)
      this._logService.error(`error when init hexo instance. `)
      this._logService.error(
        `retry in ${HexoInstanceService.RETRY_INTERVAL} ms.`,
        `${HexoInstanceService.CURRENT_RETRY}/${HexoInstanceService.MAX_RETRY}`
      )

      if (HexoInstanceService.CURRENT_RETRY >= HexoInstanceService.MAX_RETRY) {
        HexoInstanceService.INIT_ERROR = new HexoCoreInitError(String(err))
        HexoInstanceService.INITING = false
        HexoInstanceService.CURRENT_RETRY = 0
        throw HexoInstanceService.INIT_ERROR
      }
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.init(true))
        }, HexoInstanceService.RETRY_INTERVAL)
      })
    }
  }

  async getBaseDir() {
    if (!this._ready) await this.init()
    return this._base
  }

  async getInstance() {
    if (!this._ready) await this.init()
    this._logService.log("instance required")
    return this._hexo
  }

  async getInstanceWithOriginOptions(
    genOptions: (
      options: HexoCore.InstanceOptions
    ) => HexoCore.InstanceOptions = (o) => o
  ) {
    const newOptions = genOptions(this._options)
    const hexo = new HexoCore(this._base, newOptions)
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

  async reload() {
    HexoInstanceService.INITING = true
    try {
      HexoInstanceService.INIT_ERROR = null
      await this._hexo.unwatch()
      await this._hexo.locals.invalidate()
      await this._hexo.load()
      await this._hexo.watch()
      HexoInstanceService.INITING = false
    } catch (err) {
      this._ready = false
      HexoInstanceService.INIT_ERROR = new HexoCoreInitError(String(err))
      HexoInstanceService.INITING = false
      throw HexoInstanceService.INIT_ERROR
    }
  }
}
