import showHexoInitFailModal from "~/components/modals/hexo-init-fail-modal"
import createHttpSecureAxios from "~/lib/http-secure/src"

export const request = createHttpSecureAxios({
  baseURL: import.meta.env.DEV ? "/proxy" : "/",
})

request.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err?.response?.data
    if (data?.id === "HexoInitError") showHexoInitFailModal(data?.message)
    return Promise.reject(err)
  }
)
