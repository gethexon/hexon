import { hex, rgb } from "color-convert"
import { createTheme } from "@winwin/vue-global-theming"

type modifier = "l" | "a" | "d"
type amount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type ModifiedColor = {
  [key in `${modifier}${amount}`]: string
}

type modifyFn = (name: string, amt: number) => string
type modifierFnMap = { [key in modifier]: modifyFn }

const modifiers: modifierFnMap = {
  l: (name, amt) => {
    // 变白
    const [r, g, b] = hex.rgb(name)
    const go = (c: number) => c + Math.abs(255 - c) * amt
    return `#${rgb.hex([go(r), go(g), go(b)])}`
  },
  d: (name, amt) => {
    // 变黑
    const [r, g, b] = hex.rgb(name)
    const go = (c: number) => c * (1 - amt)
    return `#${rgb.hex([go(r), go(g), go(b)])}`
  },
  a: (name, amt) => {
    // 变透明
    const alpha = Math.round((1 - amt) * 255).toString(16)
    return `${name}${alpha}`
  },
}

function createColor(name: string): ColorPack {
  const indexs = new Array(9).fill(0).map((v, i) => (i + 1) / 10)
  function createModifiedColor(type: modifier) {
    return indexs
      .map((amt) => modifiers[type](name, amt))
      .reduce((o, v, idx) => {
        o[`${type}${(idx + 1) as amount}`] = v
        return o
      }, {} as ModifiedColor)
  }
  return {
    n: name,
    ...createModifiedColor("a"),
    ...createModifiedColor("d"),
    ...createModifiedColor("l"),
  }
}

type ColorPack = ModifiedColor & {
  n: string
}

export type HTheme = {
  color: {
    primary: ColorPack
    success: ColorPack
    warning: ColorPack
    error: ColorPack
    common: ColorPack
    folder: string
    all: string
    post: string
    page: string
    draft: string
    black: string
    white: string
    background: {
      transparent: string
      hover: string
      active: string
      selected: string
      /**
       * 右侧栏
       */
      base1: string
      /**
       * 中间栏
       */
      base2: string
      /**
       * 左侧栏
       */
      base3: string
      badge: string
      /**
       * 亮主题的白
       */
      max: string
      /**
       * 亮主题的黑
       */
      min: string
    }
    foreground: {
      main: string
      sub: string
      /**
       * 亮主题的黑
       */
      max: string
      /**
       * 亮主题的白
       */
      min: string
    }
  }
}

export const lightTheme: HTheme = {
  color: {
    primary: createColor("#3498db"),
    success: createColor("#27ae60"),
    warning: createColor("#f39c12"),
    error: createColor("#e74c3c"),
    common: createColor("#888888"),
    folder: "#f3c04f",
    all: "#27ae60",
    post: "#3883c7",
    page: "#52bad1",
    draft: "#f1c40f",
    black: "#000000",
    white: "#ffffff",
    background: {
      transparent: "transparent",
      hover: "#00000015",
      active: "#00000020",
      selected: "#00000010",
      base1: "#ffffff",
      base2: "#f8f8f8",
      base3: "#eeeeee",
      badge: "#cccccc",
      max: "#ffffff",
      min: "#000000",
    },
    foreground: {
      main: "#484848",
      sub: "#757575",
      max: "#000000",
      min: "#ffffff",
    },
  },
}

export const darkTheme: HTheme = {
  color: {
    primary: createColor("#3498db"),
    success: createColor("#27ae60"),
    warning: createColor("#f39c12"),
    error: createColor("#e74c3c"),
    common: createColor("#888888"),
    folder: "#f3c04f",
    all: "#27ae60",
    post: "#3883c7",
    page: "#52bad1",
    draft: "#f1c40f",
    black: "#000000",
    white: "#ffffff",
    background: {
      transparent: "transparent",
      hover: "#ffffff15",
      active: "#ffffff20",
      selected: "#ffffff10",
      base1: "#323232",
      base2: "#282828",
      base3: "#1f1f1f",
      badge: "#3e3e3e",
      max: "#000000",
      min: "#ffffff",
    },
    foreground: {
      main: "#dddddd",
      sub: "#a9a9a9",
      max: "#ffffff",
      min: "#000000",
    },
  },
}

export default createTheme({ default: darkTheme, dark: darkTheme })
