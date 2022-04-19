import type { CommonTheme } from "@/ui/theme"
import { alpha, dark, light } from "~/utils/color"
import { ButtonTheme } from "./light"

const self = (common: CommonTheme) => {
  function hover(color: string) {
    return light(color, 0.2)
  }
  function active(color: string) {
    return dark(color, 0.4)
  }
  function hoverInverted(color: string) {
    return alpha(color, 0.9)
  }
  function activeInverted(color: string) {
    return alpha(color, 0.8)
  }
  return {
    ...common,
    backgroundColorHoverPrimary: hover(common.colorPrimary),
    backgroundColorHoverSuccess: hover(common.colorSuccess),
    backgroundColorHoverWarning: hover(common.colorWarning),
    backgroundColorHoverError: hover(common.colorError),
    backgroundColorHoverCommon: hover(common.colorCommon),
    backgroundColorHoverInvertedPrimary: hoverInverted(common.colorPrimary),
    backgroundColorHoverInvertedSuccess: hoverInverted(common.colorSuccess),
    backgroundColorHoverInvertedWarning: hoverInverted(common.colorWarning),
    backgroundColorHoverInvertedError: hoverInverted(common.colorError),
    backgroundColorHoverInvertedCommon: hoverInverted(common.colorCommon),
    backgroundColorActivePrimary: active(common.colorPrimary),
    backgroundColorActiveSuccess: active(common.colorSuccess),
    backgroundColorActiveWarning: active(common.colorWarning),
    backgroundColorActiveError: active(common.colorError),
    backgroundColorActiveCommon: active(common.colorCommon),
    backgroundColorActiveInvertedPrimary: activeInverted(common.colorPrimary),
    backgroundColorActiveInvertedSuccess: activeInverted(common.colorSuccess),
    backgroundColorActiveInvertedWarning: activeInverted(common.colorWarning),
    backgroundColorActiveInvertedError: activeInverted(common.colorError),
    backgroundColorActiveInvertedCommon: activeInverted(common.colorCommon),
    colorActiveInvertedPrimary: active(common.colorPrimary),
    colorActiveInvertedSuccess: active(common.colorSuccess),
    colorActiveInvertedWarning: active(common.colorWarning),
    colorActiveInvertedError: active(common.colorError),
    colorActiveInvertedCommon: active(common.colorCommon),
  }
}
const buttonDark: ButtonTheme = {
  name: "Button",
  self,
}

export default buttonDark
