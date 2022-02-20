import { formatMarkdown } from "./prettier-formatter"

describe("format", () => {
  it("should format markdown", () => {
    const str = "#  title"
    const res = formatMarkdown(str)
    expect(res).toMatch("# title")
  })
})
