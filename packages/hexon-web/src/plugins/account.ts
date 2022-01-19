import { ERROR_CODE } from "hexon-typedef"
import { getErrorMessage } from "~/errors"
import { createAccount } from "~/lib/account"
import createHttpSecureAxios from "~/lib/http-secure/src"
import { forceReloadWindow } from "../utils"
import showHexoInitFailModal from "~/components/modals/hexo-init-fail-modal"

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
  finalInterceptors: {
    response: {
      onFulfilled: (res) => res,
      onRejected: (err: any) => {
        const data = err?.response?.data
        if (data?.code === ERROR_CODE.E_INIT)
          showHexoInitFailModal(data?.message)
        throw {
          ...data,
          message: getErrorMessage(err),
          raw: err?.response?.data?.message || err?.message,
        }
      },
    },
  },
})

export default account
