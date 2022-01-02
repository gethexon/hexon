import type { Theme, CommonTheme } from "@/ui/theme"

const self = (common: CommonTheme) => {
  return {
    ...common,
  }
}
export type InputVars = ReturnType<typeof self>
const inputLight: Theme<"Input", InputVars> = {
  name: "Input",
  self,
}

export default inputLight
export type InputTheme = typeof inputLight
