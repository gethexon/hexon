import { defineStore } from "pinia"
import { list2Tree, TreeNode } from "~/lib/list2tree"
import { api, BriefPage, BriefPost, Category, ICreateOptions, Tag } from "~/api"
import { list2object, object2list } from "~/utils"
import { PostOrPage } from "~/interface"
import { useDispatcher } from "./dispatcher"

export interface IState {
  username: string
  posts: {
    [key: string]: BriefPost
  }
  pages: {
    [key: string]: BriefPage
  }
  categories: {
    [key: string]: Category
  }
  tags: {
    [key: string]: Tag
  }
}

export const useMainStore = defineStore("main", {
  state: (): IState => ({
    username: "",
    posts: {},
    pages: {},
    categories: {},
    tags: {},
  }),
  actions: {
    setUsername(name: string) {
      this.username = name
      localStorage.setItem("username", name)
    },
    loadUsername() {
      this.username = localStorage.getItem("username") || ""
    },
    async getBlogData() {
      const { posts, pages, tags, categories } = await api.getAllData()
      this.posts = list2object(posts, "source")
      this.pages = list2object(pages, "source")
      this.tags = list2object(tags, "slug")
      this.categories = list2object(categories, "slug")
    },
    async deleteArticle(type: PostOrPage, source: string) {
      const { posts, pages, tags, categories } = await api.deleteArticle(
        type,
        source
      )
      this.posts = list2object(posts, "source")
      this.pages = list2object(pages, "source")
      this.tags = list2object(tags, "slug")
      this.categories = list2object(categories, "slug")
    },
    async createArticle(title: string, options: ICreateOptions = {}) {
      const data = await api.createArticle(title, options)
      const dispatcher = useDispatcher()
      if ("post" in data) {
        dispatcher.editArticle({ type: "post", source: data.post.source })
      } else {
        dispatcher.editArticle({ type: "page", source: data.page.source })
      }
    },
    async publishArticle(filename: string) {
      const article = await api.publishArticle(filename)
      await this.getBlogData()
      return article
    },
  },
  getters: {
    articles(state): (BriefPost | BriefPage)[] {
      return object2list<BriefPost | BriefPage, "source">(
        state.pages,
        "source"
      ).concat(
        object2list<BriefPost | BriefPage, "source">(state.posts, "source")
      )
    },
    allPostsList(state): BriefPost[] {
      return object2list(state.posts, "source")
    },
    publishedPostsList(state): BriefPost[] {
      return this.allPostsList.filter((post) => post.published)
    },
    draftsList(state): BriefPost[] {
      return this.allPostsList.filter((post) => !post.published)
    },
    pagesList(state): BriefPage[] {
      return object2list(state.pages, "source")
    },
    categoriesTree(): TreeNode<Category, "children">[] {
      return list2Tree(this.categoriesList, (item) => !item.parent, {
        idKey: "id",
        parentKey: "parent",
        childrenKey: "children",
      })
    },
    categoriesList(): Category[] {
      return object2list(this.categories, "slug")
    },
    tagNamesList(): string[] {
      return object2list(this.tags, "slug").map((item) => item.name)
    },
    catNamesList(): string[] {
      return this.categoriesList.map((cat) => cat.name)
    },
  },
})
