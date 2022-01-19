import { ERROR_CODE } from "hexon-typedef"

export interface IErrorDesc<T extends ERROR_CODE> {
  code: T
  message: string
}

export const ERROR_MAP: Partial<{ [key in ERROR_CODE]: IErrorDesc<key> }> = {
  [ERROR_CODE.E_INIT]: {
    code: ERROR_CODE.E_INIT,
    message: "hexo 初始化失败，请检查你的 hexo 配置",
  },
  [ERROR_CODE.E_INITIATING]: {
    code: ERROR_CODE.E_INITIATING,
    message: "hexo 初始化中，请稍后再试",
  },
  [ERROR_CODE.E_UNKNOWN]: {
    code: ERROR_CODE.E_UNKNOWN,
    message: "未知错误",
  },
  [ERROR_CODE.E_NOT_FOUND]: {
    code: ERROR_CODE.E_NOT_FOUND,
    message: "没找到，回主页看看？",
  },
}

export function getErrorMessage(err: any) {
  const data = err?.response?.data
  const code = data?.code
  const info = ERROR_MAP[code as ERROR_CODE]
  if (info) return info.message
  const message = data?.message
  if (message) return message
  return (err as Error).message
}
