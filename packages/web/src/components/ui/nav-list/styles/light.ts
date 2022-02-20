import type { Theme, CommonTheme } from "@/ui/theme"

const self = (common: CommonTheme) => {
  return {
    ...common,
    backgroundColorSelected: "#00000010",
    backgroundColorHover: "#00000015",
    backgroundColorActive: "#00000020",
  }
}
export type NavListVars = ReturnType<typeof self>
const navListLight: Theme<"NavList", NavListVars> = {
  name: "NavList",
  self,
}

export default navListLight
export type NavListTheme = typeof navListLight
