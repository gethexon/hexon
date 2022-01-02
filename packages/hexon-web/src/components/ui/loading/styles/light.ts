import type { Theme, CommonTheme } from "@/ui/theme"
import { alpha } from "~/utils/color"

const self = (common: CommonTheme) => {
  return {
    ...common,
    backgroundColorIcon: alpha(common.colorPrimary, 0.8),
  }
}
export type LoadingVars = ReturnType<typeof self>
const loadingLight: Theme<"Loading", LoadingVars> = {
  name: "Loading",
  self,
}

export default loadingLight
export type LoadingTheme = typeof loadingLight
