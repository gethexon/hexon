import type { IGlobalTheme } from "../interface"
import { commonDark } from "../common/dark"
import unkown from "./unknown"
import { buttonDark } from "@/ui/button/styles"
import { inputLight } from "@/ui/input/styles"
import { loadingLight } from "@/ui/loading/styles"
import { navListDark } from "@/ui/nav-list/styles"

export const darkTheme: IGlobalTheme = {
  unknown: unkown,
  common: commonDark,
  Button: buttonDark,
  Input: inputLight,
  Loading: loadingLight,
  NavList: navListDark,
}
