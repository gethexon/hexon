import type { CommonTheme } from "./common/light"
import type { UnkownTheme } from "./themes/unknown"
import type { ButtonTheme } from "@/ui/button/styles"
import type { InputTheme } from "@/ui/input/styles"
import type { LoadingTheme } from "@/ui/loading/styles"
import type { NavListTheme } from "@/ui/nav-list/styles"

export interface IGlobalTheme {
  common: CommonTheme
  unknown: UnkownTheme
  Button: ButtonTheme
  Input: InputTheme
  Loading: LoadingTheme
  NavList: NavListTheme
}

export interface Theme<N, T> {
  name: N
  self: (common: CommonTheme) => T
}

export type GlobalOverrides = Partial<{
  [key in keyof IGlobalTheme]: Partial<
    IGlobalTheme[key] extends Theme<key, infer R> ? R : IGlobalTheme[key]
  >
}>
