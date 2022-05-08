import path from "path"
import chalk from "chalk"
import { container } from "tsyringe"
import { StorageService } from "~/shared/storage-service"
import { logo } from "./constants"
import { printer, printVersion } from "./utils"
import { HEXON_DEFAULT_PORT, HEXON_PORT_KEY } from "~/shared/constants"
import { HexoInstanceService } from "~/server/services/hexo-instance-service"
import { AccountService } from "~/shared/account-storage-service"
import { requestPort, requestRoot, requestUserInfo } from "./prompts"

export default async function () {
  console.clear()
  console.log(chalk.blue(logo))

  printVersion()

  printer.section("Configuration")
  const storage = container.resolve(StorageService)
  storage.set<string>(HEXON_PORT_KEY, await requestPort(HEXON_DEFAULT_PORT))
  storage.set<string>(
    HexoInstanceService.HEXO_BASE_DIR_KEY,
    await requestRoot()
  )
  const { username, password } = await requestUserInfo()
  const account = container.resolve(AccountService)
  account.setUserInfo(username, password)

  printer.section("Install")
  const base = path.resolve(__dirname, "../..")
  printer.success(`Hexon has been installed to \`${base}\``)
  printer.log(`Run \`pnpm start\` to start`)
  printer.log(`Run \`pnpm prd\` to start with pm2`)
  printer.log(chalk.grey(`To uninstall, remove the following foler: ${base}`))
}
