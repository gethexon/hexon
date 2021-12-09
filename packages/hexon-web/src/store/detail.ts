import { defineStore } from "pinia"
import { getArticle } from "~/api"
import notification from "~/notification"
import { Page, Post } from "~/types"

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
      let res
      try {
        res = await getArticle(options.type, options.source)
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
      this.type = options.type
      this.article = options.type === "post" ? (res as Post) : (res as Page)
      this.tmp = ""
      this.changed = false
    },
    /**
     * 查看文章
     * @returns
     */
    async viewArticle(options: { source: string; type: "post" | "page" }) {
      await this._loadArticle(options)
      this.status = "VIEW"
    },
    /**
     * 打开已获取的文章
     */
    async editArticle(options: { source: string; type: "post" | "page" }) {
      if (
        this.status !== "VIEW" ||
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
      if (import.meta.env.DEV) {
        // TODO: switch to api
        console.log(`saved`, this.tmp)
        // TODO 获取更新后的文章
        // this.article =
        // this.tmp =
        this.status = "SAVED"
      }
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
     * 放弃更改关闭本地文章
     */
    async closeArticle() {
      if (this.status !== "SAVED" && this.status !== "CHANGED") return
      this.tmp = ""
      this.changed = false
      this.status = "VIEW"
    },
    /**
     * 清空本地文章
     */
    async clearArticle() {
      this.$reset()
    },
  },
})
