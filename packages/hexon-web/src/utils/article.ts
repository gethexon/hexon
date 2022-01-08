import { IPage, IPost } from "~/api"

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
