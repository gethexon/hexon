import { defineStore } from "pinia"
import { list2Tree, TreeNode } from "~/lib/list2tree"
import notification from "~/notification"
import { api, BriefPage, BriefPost, Category, Tag } from "~/api"
import { list2object, object2list } from "~/utils"

export interface IState {
  first: boolean
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
    first: true,
    posts: {},
    pages: {},
    categories: {},
    tags: {},
  }),
  actions: {
    // FIXME 如何处理 store 中的数据和路由切换之间的关系
    async getBlogData() {
      try {
        const { posts, pages, tags, categories } = await api.getAllData()
        this.posts = list2object(posts, "source")
        this.pages = list2object(pages, "source")
        this.tags = list2object(tags, "slug")
        this.categories = list2object(categories, "slug")
        this.first = false
      } catch (err) {
        notification.notify({
          title: "博客数据载入失败",
          desc: (err as Error).message,
          type: "error",
          duration: 5000,
        })
        throw err
      }
    },
    setCatAndTags({
      posts,
      pages,
      categories,
      tags,
    }: {
      posts: BriefPost[]
      pages: BriefPage[]
      categories: Category[]
      tags: Tag[]
    }) {
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
