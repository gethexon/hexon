import { HIconName } from "../../icon"

export interface INavItemProps {
  icon: HIconName
  text: string
  indent?: number
  selected?: boolean
  color?: string
  sub?: string | number
  uppercase?: boolean
}

export interface INavItem extends INavItemProps {
  type: "item"
  key: string
}
export interface INavTitle {
  type: "title"
  label: string
}
export type NavListItem = INavItem | INavTitle
