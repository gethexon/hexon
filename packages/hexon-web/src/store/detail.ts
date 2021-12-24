import { defineStore } from "pinia"
import { api, Page, Post } from "~/api"
import { PostOrPage } from "~/types"

interface IState {
  article: Post | Page | null
  error: boolean
  _loading: boolean
  saving: boolean
}

export const useDetailStore = defineStore("detail", {
  state: (): IState => ({
    article: null,
    error: false,
    _loading: false,
    saving: false,
  }),
  getters: {
    loading(): boolean {
      return !this.error && (this._loading || !this.article)
    },
  },
  actions: {
    async getArticle(type: PostOrPage, source: string) {
      const token = setTimeout(() => {
        this._loading = true
      }, 200)
      this.error = false
      try {
        const res = await api.getArticle(type, source)
        this.article = res
      } catch (err) {
        console.error(err)
        this.error = true
        throw err
      } finally {
        clearTimeout(token)
        this._loading = false
      }
    },
    async saveArticle(raw: string) {
      if (!this.article) return
      this.saving = true
      try {
        await api.saveArticle(
          this.article.__post ? "post" : "page",
          this.article.source,
          raw
        )
      } catch (err) {
        console.error(err)
        throw err
      } finally {
        this.saving = false
      }
    },
  },
})
