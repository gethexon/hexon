import dayjs, { Dayjs } from "dayjs"

export function dateFromString(date?: string): Dayjs | null {
  if (!date) return null
  const res = dayjs(date)
  return res.format("") === "Invalid Date" ? null : res
}
