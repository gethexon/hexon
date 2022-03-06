import { ISettings } from "@hexon/typedef"
import account from "~/plugins/account"

export async function getSettings(): Promise<ISettings> {
  return account.access.get("/settings").then((res) => res.data as ISettings)
}

export async function setSettings(settings: ISettings) {
  return account.access.post("/settings", settings)
}
