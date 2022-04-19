import chalk from "chalk"
import { container } from "tsyringe"
import { AccountService } from "~/shared/account-storage-service"

export default async function resetPassword(newpwd='admin') {
  const account = container.resolve(AccountService)
  account.setPassword(newpwd)
  console.log(chalk.green(`Password has been reset to "${newpwd}".`))
}
