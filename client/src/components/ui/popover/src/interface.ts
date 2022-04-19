export interface IRect {
  left: number
  top: number
  height: number
  width: number
}

export type Position =
  | "top-left"
  | "top"
  | "top-right"
  | "left-top"
  | "left"
  | "left-bottom"
  | "right-top"
  | "right"
  | "right-bottom"
  | "bottom-left"
  | "bottom"
  | "bottom-right"

export type TriggerType = "click" | "hover"
