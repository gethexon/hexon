import { defineStore } from "pinia"
import { list2Tree, TreeNode } from "~/lib/list2tree"
import { api, BriefPage, BriefPost, Category, Tag } from "~/api"
import { list2object, object2list } from "~/utils"
import { PostOrPage } from "~/types"

export interface IState {
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
    posts: {},
    pages: {},
    categories: {},
    tags: {},
  }),
  actions: {
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
  },
})
