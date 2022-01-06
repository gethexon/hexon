import type { Dayjs } from "dayjs"

export interface IDateData {
  text: string
  current: boolean
  selected: boolean
  date: Dayjs
}
