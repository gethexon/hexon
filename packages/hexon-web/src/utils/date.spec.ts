import dayjs from "dayjs"
import { dateFromString } from "./date"

describe("date", () => {
  it("should pass normal", () => {
    const date = dayjs()
    const str = date.toISOString()
    expect(dateFromString(str)!.valueOf()).toBe(date.valueOf())
  })

  it("should pass invalid date", () => {
    expect(dateFromString("blabla")).toEqual(null)
  })

  it("should pass empty string", () => {
    expect(dateFromString("")).toEqual(null)
  })

  it("should pass undefined", () => {
    expect(dateFromString(undefined)).toEqual(null)
  })
})
