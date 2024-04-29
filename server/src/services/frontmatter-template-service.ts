import { inject, injectable, singleton } from "tsyringe"
import { IFrontmatterTemplateItem } from "@server/types/api"
import { StorageService } from "@server-shared/storage-service"

@injectable()
@singleton()
export class FrontmatterTemplateService {
  public static KEY = "frontmatter-template"
  constructor(
    @inject(StorageService) private _storageService: StorageService
  ) {}

  _list() {
    return (
      this._storageService.get<IFrontmatterTemplateItem[]>(
        FrontmatterTemplateService.KEY
      ) || []
    )
  }

  _set(items: IFrontmatterTemplateItem[]) {
    this._storageService.set<IFrontmatterTemplateItem[]>(
      FrontmatterTemplateService.KEY,
      items
    )
  }

  async list() {
    return this._list()
  }

  async set(items: IFrontmatterTemplateItem[]) {
    this._set(items)
  }
}
