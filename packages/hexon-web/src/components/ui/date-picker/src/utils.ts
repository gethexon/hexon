import { Dayjs } from "dayjs"
import { IDateData } from "./interface"

export function lastMondayInCurrentMonth(date: Dayjs, monday: Dayjs): boolean {
  return monday.month() === date.month()
}

export function getLastMonday(date: Dayjs): Dayjs {
  const firstDayInMouth = getFirstDayInSameMonth(date)
  const weekNo = firstDayInMouth.day()
  const monday = firstDayInMouth.subtract(weekNo - 1, "day")
  if (monday.month() === date.month()) return monday.subtract(7, "day")
  else return monday
}

export function getFirstDayInSameMonth(date: Dayjs): Dayjs {
  const currentDayInMouth = date.date()
  return date.subtract(currentDayInMouth - 1, "day")
}

export function getDataByDate(date: Dayjs): IDateData[] {
  const data: IDateData[] = []
  const monthDay1 = getFirstDayInSameMonth(date)
  const currentDayInMouth = date.date()
  const lastMonday = getLastMonday(date)
  const lastMondayInMonth = lastMonday.date()
  data.push(
    ...new Array(lastMonday.daysInMonth() - lastMonday.date() + 1).fill(0).map(
      (v, idx): IDateData => ({
        text: `${lastMondayInMonth + idx}`,
        current: false,
        selected: false,
        date: lastMonday.add(idx, "day"),
      })
    )
  )

  data.push(
    ...new Array(date.daysInMonth()).fill(0).map(
      (v, idx): IDateData => ({
        text: `${idx + 1}`,
        current: true,
        selected: idx + 1 === currentDayInMouth,
        date: monthDay1.add(idx, "day"),
      })
    )
  )
  const nextMonthDay1 = monthDay1.add(monthDay1.daysInMonth(), "day")
  data.push(
    ...new Array(42 - data.length).fill(0).map(
      (v, idx): IDateData => ({
        text: `${idx + 1}`,
        current: false,
        selected: false,
        date: nextMonthDay1.add(idx, "day"),
      })
    )
  )
  return data
}
export function isAM(date: Dayjs): boolean {
  return date.hour() < 12
}
export function getTimeData(date: Dayjs): IDateData[] {
  const hour = date.hour()
  const base = date.subtract(hour < 12 ? hour : hour - 12, "hour")

  return new Array(12).fill(0).map(
    (v, idx): IDateData => ({
      text: `0${idx}`.slice(-2),
      current: idx === hour % 12,
      selected: idx === hour % 12,
      date: base.add(idx, "hour"),
    })
  )
}
