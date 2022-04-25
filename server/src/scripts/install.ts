import path from "path"
import chalk from "chalk"
import inquirer from "inquirer"
import { container } from "tsyringe"
import { StorageService } from "~/shared/storage-service"
import { isBlog, toRealPath } from "~/shared/utils"
import { logo } from "./constants"
import { printer, printVersion } from "./utils"
import { HEXON_DEFAULT_PORT, HEXON_PORT_KEY } from "~/shared/constants"
import { HexoInstanceService } from "~/server/services/hexo-instance-service"
import { AccountService } from "~/shared/account-storage-service"

async function getPort() {
  const portPrompt = {
    name: "port",
    message: "Which port do you like Hexon running at?",
    default: HEXON_DEFAULT_PORT,
    validate(v: number) {
      return !isNaN(v) || `number is required ${typeof v} given`
    },
    prefix: chalk.blue("?"),
  }
  const answer = await inquirer.prompt(portPrompt)
  return String(answer.port as number)
}

async function getRoot() {
  const rootPrompt = {
    name: "root",
    message: `Your hexo blog path? ${chalk.grey(
      "Absolute or relative path to hexon."
    )}`,
    validate(v: string) {
      const truePath = toRealPath(v)
      try {
        return (
          isBlog(truePath) ||
          chalk.red.bold(truePath) + chalk.red(" is not a valid hexo blog.")
        )
      } catch (e) {
        console.error(e)
        return chalk.red("Fail to check path " + chalk.bold(truePath))
      }
    },
  }
  const answer = await inquirer.prompt(rootPrompt)
  return answer.root as string
}

async function getUserInfo() {
  const answer = await inquirer.prompt([
    {
      name: "username",
      message: "Username ?",
      validate(v: string) {
        if (!v) return "Must not empty"
        return true
      },
    },
    {
      name: "password",
      message: "Password ?",
      validate(v: string) {
        if (!v) return "Must not empty"
        return true
      },
    },
  ])
  const { username, password } = answer as {
    username: string
    password: string
  }
  return { username, password }
}

export default async function () {
  console.clear()
  console.log(chalk.blue(logo))

  printVersion()

  printer.section("Configuration")
  const storage = container.resolve(StorageService)
  storage.set<string>(HEXON_PORT_KEY, await getPort())
  storage.set<string>(HexoInstanceService.HEXO_BASE_DIR_KEY, await getRoot())
  const { username, password } = await getUserInfo()
  const account = container.resolve(AccountService)
  account.setUserInfo(username, password)

  printer.section("Install")
  const base = path.resolve(__dirname, "../../..")
  printer.success(`Hexon has been installed to \`${base}\``)
  printer.log(`Run \`pnpm start\` to start`)
  printer.log(`Run \`pnpm prd\` to start with pm2`)
  printer.log(chalk.grey(`To uninstall, remove the following foler: ${base}`))
}
