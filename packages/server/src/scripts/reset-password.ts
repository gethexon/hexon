import { container } from "tsyringe"
import { AccountService } from "~/shared/account-storage-service"

export default async function resetPassword() {
  const account = container.resolve(AccountService)
  account.setPassword("admin")
}
