import account from "~/plugins/account"
import { HttpApiProvider } from "./http-api-provider"

export const isInstalled = async () => {
  return account.origin.get("/install").then(
    () => false,
    () => true
  )
}

export const install = async ({
  username,
  password,
  secret,
  expiresIn,
  refreshableIn,
}: {
  username: string
  password: string
  secret: string
  expiresIn: number
  refreshableIn: number
}) => {
  return account.origin.post("/install", {
    username,
    password,
    secret,
    expiresIn: expiresIn + "h",
    refreshableIn: refreshableIn + "d",
  })
}

export const api = new HttpApiProvider()

export * from "./entities"
export * from "./interface"
