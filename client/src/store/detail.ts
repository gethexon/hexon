import { defineStore } from "pinia"
import { Page, Post, api } from "~/api"
import { PostOrPage } from "~/interface"
import { isDraft, isPage, isPost } from "~/utils/article"

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
    isLoading(): boolean {
      return (this._loading || !this.article) && !this.error
    },
    isDraft(): boolean {
      return isDraft(this.article)
    },
    isPost(): boolean {
      return isPost(this.article)
    },
    isPage(): boolean {
      return isPage(this.article)
    },
  },
  actions: {
    async getArticle(type: PostOrPage, source: string) {
      const token = setTimeout(() => {
        this._loading = true
      }, 500)
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
          isPost(this.article) ? "post" : "page",
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
    clearArticle() {
      this.$reset()
    },
  },
})
