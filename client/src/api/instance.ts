import showHexoInitFailModal from "~/components/modals/hexo-init-fail-modal"
import createHttpSecureAxios from "~/lib/http-secure/src"
import { logout } from "./auth"

export const request = createHttpSecureAxios({
  baseURL: import.meta.env.DEV ? "/proxy" : "/",
})

request.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) logout()

    const data = err?.response?.data
    if (data?.id === "HexoInitError") showHexoInitFailModal(data?.message)
    return Promise.reject(err)
  }
)
