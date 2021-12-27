import { IRect, Position } from "./interface"

export function getPlacement(
  position: Position,
  containerRect: IRect,
  contentRect: IRect
) {
  let x = 0,
    y = 0,
    margin = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }
  switch (position) {
    case "top-left":
      x = containerRect.left
      y = containerRect.top - contentRect.height
      margin.bottom = 4
      break
    case "top":
      x = containerRect.left + containerRect.width / 2 - contentRect.width / 2
      y = containerRect.top - contentRect.height
      margin.bottom = 4
      break
    case "top-right":
      x = containerRect.left + containerRect.width - contentRect.width
      y = containerRect.top - contentRect.height
      margin.bottom = 4
      break
    case "right-top":
      x = containerRect.left + containerRect.width
      y = containerRect.top
      margin.left = 4
      break
    case "right":
      x = containerRect.left + containerRect.width
      y = containerRect.top + containerRect.height / 2 - contentRect.height / 2
      margin.left = 4
      break
    case "right-bottom":
      x = containerRect.left + containerRect.width
      y = containerRect.top + containerRect.height - contentRect.height
      margin.left = 4
      break
    case "bottom-left":
      x = containerRect.left
      y = containerRect.top + containerRect.height
      margin.top = 4
      break
    case "bottom":
      x = containerRect.left + containerRect.width / 2 - contentRect.width / 2
      y = containerRect.top + containerRect.height
      margin.top = 4
      break
    case "bottom-right":
      x = containerRect.left + containerRect.width - contentRect.width
      y = containerRect.top + containerRect.height
      margin.top = 4
      break
    case "left-top":
      x = containerRect.left - contentRect.width
      y = containerRect.top
      margin.right = 4
      break
    case "left":
      x = containerRect.left - contentRect.width
      y = containerRect.top + containerRect.height / 2 - contentRect.height / 2
      margin.right = 4
      break
    case "left-bottom":
      x = containerRect.left - contentRect.width
      y = containerRect.top + containerRect.height - contentRect.height
      margin.right = 4
      break
    default:
      break
  }

  return { x, y, margin }
}
