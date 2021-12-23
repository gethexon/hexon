import { defineStore } from "pinia"
import { BriefPage, BriefPost } from "~/api"

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
type Filter =
  | AllFilter
  | PostFilter
  | pageFilter
  | DraftFilter
  | CategorieFilter
  | TagFilter

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
            return articles.filter((article) => article.__page)
          case "post":
            return articles.filter((article) => article.__post)
          case "draft":
            return articles.filter(
              (article) => article.__post && !article.published
            )
          case "category":
            return (
              articles.filter((article) => article.__post) as BriefPost[]
            ).filter((post) => post.categories?.includes(filter.slug))
          case "tag":
            return (
              articles.filter((article) => article.__post) as BriefPost[]
            ).filter((post) => post.tags?.includes(filter.slug))
          default:
            return [] as never[]
        }
      }
    },
  },
})
