import showHexoInitFailModal from "~/components/modals/hexo-init-fail-modal"
import createHttpSecureAxios from "~/lib/http-secure/src"
import { logout } from "./auth"

export const request = createHttpSecureAxios({
  baseURL: import.meta.env.DEV ? "/proxy" : "/",
})

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * do not logout or reload window when authentication failed
     */
    disableAuthenticationRedirect?: boolean
  }
}

request.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      !err?.config?.disableAuthenticationRedirect &&
      err?.response?.status === 401
    )
      logout()

    const data = err?.response?.data
    if (data?.id === "HexoInitError") showHexoInitFailModal(data?.message)
    throw err
  }
)
