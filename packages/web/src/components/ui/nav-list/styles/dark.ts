import type { CommonTheme } from "@/ui/theme"
import { NavListTheme } from "./light"

const self = (common: CommonTheme) => {
  return {
    ...common,
    backgroundColorSelected: "#00000040",
    backgroundColorHover: "#00000050",
    backgroundColorActive: "#00000070",
  }
}
const navListDark: NavListTheme = {
  name: "NavList",
  self,
}
export default navListDark
