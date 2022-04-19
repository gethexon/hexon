import dayjs from "dayjs"
import { IHArticleListData } from "./interface"

export function sortArticleByTime(
  articles: IHArticleListData[]
): IHArticleListData[] {
  return articles.sort((a, b) => {
    const da = dayjs(a.date)
    const db = dayjs(b.date)
    if (!da.isValid()) return -1
    if (!db.isValid()) return 1
    return da.valueOf() > db.valueOf() ? -1 : 1
  })
}
