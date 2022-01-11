import { SHA1 } from "crypto-js"
import Debug from "debug"

export function encrypt(raw: string): string {
  return SHA1(raw).toString()
}

export const debug = Debug("koa-simple-account")
