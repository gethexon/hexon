import type { IGlobalTheme } from "../interface"
import commonLight from "../common/light"
import unkown from "./unknown"
import { buttonLight } from "@/ui/button/styles"
import { inputLight } from "@/ui/input/styles"
import { loadingLight } from "@/ui/loading/styles"
import { navListLight } from "@/ui/nav-list/styles"

const lightTheme: IGlobalTheme = {
  unknown: unkown,
  common: commonLight,
  Button: buttonLight,
  Input: inputLight,
  Loading: loadingLight,
  NavList: navListLight,
}

export default lightTheme
