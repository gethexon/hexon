import { hex, rgb } from "color-convert";
import { ITheme } from "./lib/theme";
const lighten = (name: string, amt: number): string => {
  const [r, g, b] = hex.rgb(name);
  const go = (c: number) => c + Math.abs(255 - c) * amt;
  return `#${rgb.hex([go(r), go(g), go(b)])}`;
};
const createColor = (name: string) => {
  return {
    0: name,
    l2: lighten(name, 0.2),
    l4: lighten(name, 0.4),
    l8: lighten(name, 0.8),
    l9: lighten(name, 0.9),
  };
};
export interface IColorPack extends ITheme {
  0: string;
  l2: string;
  l4: string;
  l8: string;
  l9: string;
}
export interface HTheme extends ITheme {
  color: {
    primary: IColorPack;
    success: IColorPack;
    warning: IColorPack;
    error: IColorPack;
    background: {
      1: string;
      2: string;
      3: string;
      9: string;
    };
    foreground: {
      1: string;
      2: string;
      3: string;
    };
    white: string;
  };
} // https://flatuicolors.com/palette/defo
export const blueTheme: HTheme = {
  color: {
    primary: createColor("#3498db"),
    success: createColor("#27ae60"),
    warning: createColor("#f39c12"),
    error: createColor("#e74c3c"),
    background: {
      1: "#ffffff",
      2: "#f8f8f8",
      3: "#eeeeee",
      9: "#282828",
    },
    foreground: {
      1: "#000000",
      2: "#484848",
      3: "#000000",
    },
    white: "#ffffff",
  },
};
