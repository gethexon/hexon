import { ISettings } from "@shared/types/api"
import { inject, injectable, singleton } from "tsyringe"
import { StorageService } from "@server-shared/storage-service"

@injectable()
@singleton()
export class SettingsService {
  public static KEY = "settings"
  constructor(
    @inject(StorageService) private _storageService: StorageService
  ) {}

  async get(): Promise<Partial<ISettings>> {
    return (
      this._storageService.get<Partial<ISettings>>(SettingsService.KEY) || {}
    )
  }

  async set(settings: Partial<ISettings>) {
    this._storageService.set<Partial<ISettings>>(SettingsService.KEY, settings)
  }
}
