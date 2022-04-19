import { categories2Array2d, isMultiCategories } from "./utils"

describe("multi-categories", () => {
  it("should be multi-categories", () => {
    const categories = ["C1", ["C21", "C22"]]
    expect(isMultiCategories(categories)).toBe(true)
  })

  it("should not be multi-categories", () => {
    const categories = ["C1", "C2"]
    expect(isMultiCategories(categories)).toBe(false)
  })
})

describe("categories2Array2d", () => {
  it("should transform multi-categories to string[][]", () => {
    const categories = ["C1", ["C21", "C22"]]
    expect(categories2Array2d(categories)).toEqual([["C1"], ["C21", "C22"]])
  })

  it("should transform not multi-categories to string[][]", () => {
    const categories = ["C1", "C2", "C3"]
    expect(categories2Array2d(categories)).toEqual([["C1", "C2", "C3"]])
  })
  it("should transform [] to []", () => {
    const categories: string[] = []
    expect(categories2Array2d(categories)).toEqual([])
  })
})
