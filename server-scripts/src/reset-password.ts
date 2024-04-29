import chalk from "chalk"
import { container } from "tsyringe"
import { AccountService } from "@server-shared/account-storage-service"
import { requestPassword } from "./prompts"

export default async function resetPassword() {
  const account = container.resolve(AccountService)
  console.log(chalk.yellow(`Resetting password for user '${account.getUsername()}' ...`))
  const newpwd = await requestPassword()
  account.setPassword(newpwd)
  console.log(chalk.green(`Password has been reset.`))
}
