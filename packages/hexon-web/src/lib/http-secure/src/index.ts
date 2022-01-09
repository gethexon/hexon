import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import CryptoJS from "crypto-js"
import JSEncrypt from "jsencrypt"

interface IHttpSecureOption {
  onDisable?(): void
}

interface IRawData {
  url: string
  data: any
}

function parse(data?: string) {
  const str = data ? data : "{}"
  return JSON.parse(str)
}

export default function createHttpSecureAxios(
  config?: AxiosRequestConfig,
  option: IHttpSecureOption = {}
) {
  let id = 1

  const rawMap = new Map<number, IRawData>()

  const onDisable = option.onDisable ?? (() => {})
  const instance = axios.create(config)

  instance.defaults.httpSecureDisabled = false

  const storage: {
    serverPublicKey?: string
    key: string
  } = {
    key: Math.random().toString(),
  }

  function decryptAES(data: string) {
    return CryptoJS.AES.decrypt(data, storage.key).toString(CryptoJS.enc.Utf8)
  }
  function encryptAES(data: string) {
    return CryptoJS.AES.encrypt(data, storage.key).toString()
  }
  function encryptRSA(data?: string) {
    if (!data) return
    const o = new JSEncrypt()
    o.setPublicKey(storage.serverPublicKey!)
    const res = o.encrypt(data)
    return res
  }
  async function fetchPublicKey(config: AxiosRequestConfig) {
    const res = await axios
      .get("/publickey", { baseURL: config.baseURL })
      .catch(async (err) => {
        if (err.response) {
          if ((err.response as AxiosResponse).status === 404) {
            console.log("server not support, http-secure has been disabled")
            config.httpSecureDisabled = true
            await onDisable()
            return undefined
          }
        }
        throw err
      })
    storage.serverPublicKey = res?.data
  }

  const prefix = "/secure/"
  instance.interceptors.request.use(async (config) => {
    if (config.httpSecureDisabled) return config

    //#region save url
    config.httpSecureId = id
    rawMap.set(id, { url: config.url || "", data: config.data })
    id++
    //#endregion

    //#region get server public key
    if (!storage.serverPublicKey) {
      await fetchPublicKey(config)
      if (!storage.serverPublicKey) return config
    }
    //#endregion

    //#region encrypt
    const key = storage.key
    const url = config.url
    config.url =
      prefix +
      encodeURIComponent(encryptRSA(JSON.stringify({ key, url })) ?? "")
    const content = encryptAES(JSON.stringify(config.data ?? ""))
    config.data = { content }
    //#endregion
    return config
  })

  instance.interceptors.response.use(
    (res) => {
      if (res.config.httpSecureDisabled) return res

      //#region restore url
      if (res.config.httpSecureId !== void 0) {
        const { url = "", data = {} } =
          rawMap.get(res.config.httpSecureId) || {}
        res.config.url = url
        res.config.data = data
        rawMap.delete(res.config.httpSecureId)
      }
      //#endregion

      //#region decrypt
      const { content } = res.data as { content?: string }
      res.data = parse(decryptAES(content || ""))
      //#endregion

      //#region log because devtools network won't work
      console.groupCollapsed(
        `[${res.status}][${res.config.method?.toUpperCase()}]${res.config.url}`
      )
      console.log("%c[config] %O", "font-weight:bolder", res.config)
      console.log("%c[request] %O", "font-weight:bolder", res.request)
      console.log("%c[data] %O", "font-weight:bolder", res.data)
      console.log("%c[headers] %O", "font-weight:bolder", res.headers)
      console.groupEnd()
      //#endregion
      return res
    },
    async (err) => {
      if (err.response) {
        const res = err.response as AxiosResponse
        //#region restore url
        if (res.config.httpSecureId !== void 0) {
          const { url = "", data = {} } =
            rawMap.get(res.config.httpSecureId) || {}
          res.config.url = url
          res.config.data = data
          rawMap.delete(res.config.httpSecureId)
        }
        //#endregion

        //#region invalid publicKey
        if (res.status === 403 && res.data.code === "EHTTPSECURE") {
          await fetchPublicKey(res.config)
          return instance(res.config)
        }
        //#endregion

        //#region decrypt
        const { content } = res.data as { content?: string }
        res.data = parse(decryptAES(content || ""))
        //#endregion

        //#region log because devtools network won't work
        const style = "color: red"
        console.groupCollapsed(
          `%c[${res.status}][${res.config.method?.toUpperCase()}]${
            res.config.url
          }`,
          style
        )
        console.log("%c[config] %O", "font-weight:bolder", res.config)
        console.log("%c[request] %O", "font-weight:bolder", res.request)
        console.log("%c[data] %O", "font-weight:bolder", res.data)
        console.log("%c[headers] %O", "font-weight:bolder", res.headers)
        console.groupEnd()
        //#endregion
      }
      throw err
    }
  )
  return instance
}

declare module "axios" {
  interface AxiosRequestConfig {
    /**
     * disable http security
     */
    httpSecureDisabled?: boolean
    httpSecureId?: number
  }
}
