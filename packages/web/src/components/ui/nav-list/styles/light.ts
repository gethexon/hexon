import type { Theme, CommonTheme } from "@/ui/theme"

const self = (common: CommonTheme) => {
  return {
    ...common,
  }
}
export type NavListVars = ReturnType<typeof self>
const navListLight: Theme<"NavList", NavListVars> = {
  name: "NavList",
  self,
}

export default navListLight
export type NavListTheme = typeof navListLight
