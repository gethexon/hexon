/**
 * use to make type in useTheme hook work
 */

import { Theme } from "../interface"

const unkown: Theme<"unknown", unknown> = {
  name: "unknown",
  self(c) {
    return c
  },
}

export type UnkownTheme = typeof unkown

export default unkown
