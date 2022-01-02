import type { Theme, CommonTheme } from "@/ui/theme"
import { light } from "~/utils/color"

const self = (common: CommonTheme) => {
  function hover(color: string) {
    return light(color, 0.2)
  }
  function active(color: string) {
    return light(color, 0.4)
  }
  return {
    ...common,
    colorHoverPrimary: hover(common.colorPrimary),
    colorHoverSuccess: hover(common.colorSuccess),
    colorHoverWarning: hover(common.colorWarning),
    colorHoverError: hover(common.colorError),
    colorHoverCommon: hover(common.colorCommon),
    colorActivePrimary: active(common.colorPrimary),
    colorActiveSuccess: active(common.colorSuccess),
    colorActiveWarning: active(common.colorWarning),
    colorActiveError: active(common.colorError),
    colorActiveCommon: active(common.colorCommon),
  }
}
export type ButtonVars = ReturnType<typeof self>
const buttonLight: Theme<"Button", ButtonVars> = {
  name: "Button",
  self,
}

export default buttonLight
export type ButtonTheme = typeof buttonLight
