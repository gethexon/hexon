import { defineStore } from "pinia"
import { BriefPage, BriefPost } from "~/api"
import { isDraft, isPage, isPost } from "~/utils/article"

type AllFilter = {
  type: "all"
}
type PostFilter = {
  type: "post"
}
type pageFilter = {
  type: "page"
}
type DraftFilter = {
  type: "draft"
}
type CategorieFilter = {
  type: "category"
  slug: string
}
type TagFilter = {
  type: "tag"
  slug: string
}
type SaysFilter = {
  type: "says"
  slug:string
}
type Filter =
  | AllFilter
  | PostFilter
  | pageFilter
  | DraftFilter
  | CategorieFilter
  | TagFilter
  | SaysFilter

interface IState {
  filter: Filter
}
export const useArticleListStore = defineStore("article-list", {
  state: (): IState => ({ filter: { type: "all" } }),
  actions: {
    setFilter(filter: Filter) {
      this.filter = filter
    },
  },
  getters: {
    articleFilter(state) {
      const filter = state.filter
      return (articles: (BriefPage | BriefPost)[]) => {
        switch (filter.type) {
          case "all":
            return articles
          case "page":
            return articles.filter(isPage)
          case "post":
            return articles.filter(isPost)
          case "draft":
            return articles.filter(isDraft)
          case "category":
            return (articles.filter(isPost) as BriefPost[]).filter((post) =>
              post.categories?.includes(filter.slug)
            )
          case "tag":
            return (articles.filter(isPost) as BriefPost[]).filter((post) =>
              post.tags?.includes(filter.slug)
            )
          case "says":
            return []
          default:
            return [] as never[]
        }
      }
    },
  },
})
