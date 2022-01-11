import { createAccount } from "~/lib/account"
import createHttpSecureAxios from "~/lib/http-secure/src"
import { forceReloadWindow } from "../utils"

const account = createAccount({
  baseURL: import.meta.env.DEV ? "/proxy" : "/",
  onTokenExpire: () => {
    forceReloadWindow()
  },
  getAxiosInstance: (config) => {
    return createHttpSecureAxios(config, {
      onDisable: () => {
        account.origin.defaults.httpSecureDisabled = true
        account.access.defaults.httpSecureDisabled = true
        account.refresh.defaults.httpSecureDisabled = true
      },
    })
  },
})

export default account
