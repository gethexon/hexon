import { light } from "~/utils/color"
import { base, CommonTheme } from "./light"

export const commonDark: CommonTheme = {
  ...base,
  isDark: true,
  backgroundColorPrimary: "#323232",
  backgroundColorSecondary: "#282828",
  backgroundColorTertiary: "#1f1f1f",
  backgroundColorSelected: "#00000020",
  backgroundColorHover: "#00000030",
  backgroundColorActive: "#00000040",
  backgroundColorBadge: "#3e3e3e",
  textColorPrimary: "#cccccc",
  textColorBack: "#000000",

  colorPrimaryHover: light(base.colorPrimary, 0.2),
  colorPrimaryActive: light(base.colorPrimary, 0.4),
  colorErrorHover: light(base.colorError, 0.2),
  colorErrorActive: light(base.colorError, 0.4),
}
