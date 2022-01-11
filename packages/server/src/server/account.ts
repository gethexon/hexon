import "reflect-metadata"
import { createSimpleAccount } from "./lib/account"
import { container } from "tsyringe"
import path from "path"
import { StorageService } from "~/shared/storage-service"

const account = createSimpleAccount({
  path: path.resolve(process.cwd(), "data/account.db"),
  secret: "secret",
  expiresIn: "10min",
  refreshableIn: "7d",
  storage: container.resolve(StorageService),
})

export default account
