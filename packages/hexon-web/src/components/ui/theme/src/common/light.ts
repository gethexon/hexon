import { light } from "~/utils/color"

const base = {
  colorPrimary: "#3498db",
  colorSuccess: "#27ae60",
  colorWarning: "#f39c12",
  colorError: "#e74c3c",
  colorCommon: "#888888",
  colorWhite: "#ffffff",
  colorTransparent: "transparent",
  backgroundColorPrimary: "#ffffff",
  backgroundColorSecondary: "#f8f8f8",
  backgroundColorTertiary: "#eeeeee",
  backgroundColorTransparent: "transparent",
  backgroundColorHover: "#00000015",
  textColorPrimary: "#484848",
  textColorSecondary: "#757575",
  textColorBack: "#ffffff",
  colorFolder: "#f3c04f",
  colorAll: "#27ae60",
  colorPost: "#3883c7",
  colorPage: "#52bad1",
  colorDraft: "#f1c40f",
}

const commonTheme = {
  ...base,
  colorPrimaryHover: light(base.colorPrimary, 0.2),
  colorPrimaryActive: light(base.colorPrimary, 0.4),
  colorErrorHover: light(base.colorError, 0.2),
  colorErrorActive: light(base.colorError, 0.4),
}

export type CommonTheme = typeof commonTheme
export default commonTheme
