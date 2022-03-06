import { ISettings } from "@hexon/typedef"
import { merge } from "lodash-es"
import { defineStore } from "pinia"
import { getSettings, setSettings } from "~/api/settings"

const DEFAULT: ISettings = {
  ui: {
    editor: {
      fontFamily:
        "PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif",
    },
  },
}

function withDefault(settings: Partial<ISettings> = {}) {
  return merge({}, DEFAULT, settings)
}

export const useSettingsStore = defineStore("settings", {
  state: (): { settings: ISettings } => ({ settings: withDefault() }),
  actions: {
    async load() {
      const part = await getSettings()
      this.settings = withDefault(part)
    },
    async save() {
      await setSettings(this.settings)
    },
  },
})
