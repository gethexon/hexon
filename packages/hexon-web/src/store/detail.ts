import { defineStore } from "pinia"
import { api, Page, Post } from "~/api"
import notification from "~/notification"
import { useMainStore } from "./main"

interface IState {
  type: "post" | "page" | null
  /**
   * 用于显示的文章数据
   */
  article: Post | Page | null
  /**
   * 用于编辑的缓存 raw
   */
  tmp: string
  changed: boolean
  status: "INIT" | "VIEW" | "SAVED" | "CHANGED" | "ERRORED"
}
export const useDetailStore = defineStore("detail", {
  state: (): IState => ({
    type: null,
    article: null,
    tmp: "",
    changed: false,
    status: "INIT",
  }),
  getters: {
    errored(): boolean {
      return this.status === "ERRORED"
    },
    identifier(): string {
      return (this.article?.source ?? "" + this.type ?? "") || "unkown"
    },
  },
  actions: {
    /**
     * 从服务器获取文章并
     * @param
     */
    async _loadArticle(options: { source: string; type: "post" | "page" }) {
      try {
        this.article = await api.getArticle(options.type, options.source)
        this.type = options.type
        this.tmp = ""
        this.changed = false
      } catch (err) {
        notification.notify({
          title: "文章载入失败",
          desc: (err as Error).message,
          type: "error",
          duration: 5000,
        })
        this.$reset()
        this.status = "ERRORED"
        throw err
      }
    },
    /**
     * 查看文章
     * @returns
     */
    async viewArticle(options: { source: string; type: "post" | "page" }) {
      if (
        // 不是从编辑状态跳转来
        (this.status !== "SAVED" && this.status !== "CHANGED") ||
        // 或者不是这篇文章
        this.article?.source !== options.source ||
        this.type !== options.type
      ) {
        await this._loadArticle(options)
      }
      this.status = "VIEW"
    },
    /**
     * 打开已获取的文章
     */
    async editArticle(options: { source: string; type: "post" | "page" }) {
      if (
        // 不是从查看状态跳转来
        this.status !== "VIEW" ||
        // 或者不是这篇文章
        this.article?.source !== options.source ||
        this.type !== options.type
      ) {
        await this._loadArticle(options)
      }
      this.tmp = this.article?.raw ?? ""
      this.changed = false
      this.status = "SAVED"
    },
    /**
     * 保存当前更改到服务器
     */
    async saveArticle() {
      if (this.status !== "CHANGED") return
      if (!this.article || !this.type) return
      const mainStore = useMainStore()
      await api
        .saveArticle(this.type, this.article.source, this.tmp)
        .then((res) => {
          const { categories, tags, pages, posts } = res
          mainStore.setCatAndTags({ categories, tags, pages, posts })
          this.article = "post" in res ? res.post : res.page
          this.tmp = this.article.raw ?? ""
        })
        .then(() => {
          this.status = "SAVED"
        })
        .catch((err) => {
          notification.notify({
            title: "文章保存失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
          throw err
        })
    },
    /**
     * 更新本地文章
     * @param updatedRaw 更新后的 raw
     * @returns
     */
    async updateArticle(updatedRaw: string) {
      if (this.status !== "SAVED" && this.status !== "CHANGED") return
      this.tmp = updatedRaw
      this.changed = true
      this.status = "CHANGED"
    },
    /**
     * 清空本地文章
     */
    async clearArticle() {
      this.$reset()
    },
  },
})
