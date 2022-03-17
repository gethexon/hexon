import type { CommonTheme } from "@/ui/theme"
import { NavListTheme } from "./light"

const self = (common: CommonTheme) => {
  return {
    ...common,
  }
}
const navListDark: NavListTheme = {
  name: "NavList",
  self,
}
export default navListDark
