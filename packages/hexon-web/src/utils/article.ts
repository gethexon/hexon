import { Dayjs } from "dayjs"
import { IPage, IPost, Page, Post } from "~/api"
import { dateFromString } from "./date"
import { parseHfm } from "./hfm"

export function isDraft(article: IPage | IPost | null): boolean {
  if (article && "published" in article && !article.published) return true
  else return false
}

export function isPost(article: IPage | IPost | null): boolean {
  if (article && "__post" in article) return true
  else return false
}
export function isPage(article: IPage | IPost | null): boolean {
  if (article && "__page" in article) return true
  else return false
}

export interface IParsedArticleMeta {
  type: "post" | "page"
  isDraft: boolean
  title: string
  tags: string[]
  categories: string[]
  date: Dayjs | null
  updated: Dayjs | null
  source: string
  fm: {
    [key: string]: unknown
  }
}

export function parseArticleData(
  article: Page | Post | null
): IParsedArticleMeta {
  if (!article)
    return {
      type: "post" as const,
      isDraft: false,
      title: "",
      tags: [],
      categories: [],
      date: null,
      updated: null,
      source: "",
      fm: {},
    }
  const { _content, title, date, updated, layout, tags, categories, ...rest } =
    parseHfm(article.raw)
  return {
    type: isPage(article) ? "page" : "post",
    isDraft: isDraft(article),
    title: article.title,
    tags: isPage(article) ? [] : tags,
    categories: isPage(article) ? [] : categories,
    date: dateFromString(article.date),
    updated: dateFromString(article.updated),
    source: article.source,
    fm: rest,
  }
}
