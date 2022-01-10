import dayjs from "dayjs"
import {
  isAM,
  getDataByDate,
  getFirstDayInSameMonth,
  getLastMonday,
  lastMondayInCurrentMonth,
} from "./utils"

describe("date", () => {
  it("should get first day", () => {
    const date = getFirstDayInSameMonth(dayjs())
    expect(date.date()).toBe(1)
  })
  it("should get monday", () => {
    const date = getLastMonday(dayjs())
    expect(date.day()).toBe(1)
  })
  it("should not in current month", () => {
    const date = dayjs("2022-1-6")
    const monday = getLastMonday(date)
    const res = lastMondayInCurrentMonth(date, monday)
    expect(res).toBe(false)
  })
  it("should in current month", () => {
    const date = dayjs("2007-6-30")
    const monday = getLastMonday(date)
    const res = lastMondayInCurrentMonth(date, monday)
    expect(res).toBe(false)
  })
  it("should be am", () => {
    const res = isAM(dayjs("2020-1-1 11:00"))
    expect(res).toBe(true)
  })
})
