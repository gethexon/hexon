import { ensureTitle, parseHfm } from "./hfm"

describe("ensureTitle", () => {
  it("adds the article title when front matter does not contain one", () => {
    const raw = ensureTitle("---\ndate: 2024-01-01\n---\ncontent", "草稿标题")

    expect(parseHfm(raw).title).toBe("草稿标题")
  })

  it("adds the article title to an empty raw document", () => {
    expect(parseHfm(ensureTitle("", "草稿标题")).title).toBe("草稿标题")
  })

  it("keeps an existing front matter title", () => {
    const raw = "---\ntitle: 原标题\n---\ncontent"

    expect(ensureTitle(raw, "新标题")).toBe(raw)
  })
})
