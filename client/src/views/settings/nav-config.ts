import { computed, markRaw } from "vue"
import { HIconName } from "@/ui/icon"
import { useThemeVars } from "@/ui/theme"
import UserView from "./tabs/UserView.vue"
import SecurityView from "./tabs/SecurityView.vue"
import StyleView from "./tabs/StyleView.vue"
import AboutView from "./tabs/AboutView.vue"
import HelpView from "./tabs/HelpView.vue"

export function useNavConfig() {
  const vars = useThemeVars()
  const config = [
    {
      type: "item" as const,
      text: "用户",
      icon: HIconName.Contact,
      color: vars.value.colorSuccess,
      key: "user" as const,
      comp: markRaw(UserView),
    },
    {
      type: "item" as const,
      text: "样式",
      icon: HIconName.OEM,
      color: vars.value.colorWarning,
      key: "style" as const,
      comp: markRaw(StyleView),
    },
    {
      type: "item" as const,
      text: "关于",
      icon: HIconName.Info,
      color: vars.value.textColorSecondary,
      key: "about" as const,
      comp: markRaw(AboutView),
    },
  ]
  const fullConfig = computed(() => {
    return config.map((value, idx) => ({ idx, ...value }))
  })
  function getConfig(key: typeof fullConfig.value[number]["key"]) {
    return fullConfig.value.find((item) => item.key === key)!
  }
  return { config: fullConfig, getConfig }
}
