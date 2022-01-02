import { rgb, hex } from "color-convert"

export function light(name: string, amt: number) {
  const [r, g, b] = hex.rgb(name)
  const go = (c: number) => c + Math.abs(255 - c) * amt
  return `#${rgb.hex([go(r), go(g), go(b)])}`
}

export function alpha(name: string, amt: number) {
  // 变透明
  const alpha = Math.round((1 - amt) * 255).toString(16)
  return `${name}${alpha}`
}
