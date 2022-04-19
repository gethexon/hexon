import { ISettings } from "@server/server/types/api"
import { request } from "./instance"

export async function getSettings(): Promise<ISettings> {
  return request.get("/settings").then((res) => res.data as ISettings)
}

export async function setSettings(settings: ISettings) {
  return request.post("/settings", settings)
}
