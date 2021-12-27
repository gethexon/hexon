import { defineStore } from "pinia"
import { IArticleIdentifier, PostOrPage } from "~/types"
import { useDetailStore } from "./detail"
import { useMainStore } from "./main"

export const useDispatcher = defineStore("dispatcher", {
  state: () => ({}),
  actions: {
    deleteArticle(id: IArticleIdentifier) {
      const mainStore = useMainStore()
      this.dialog.create({
        type: "warning",
        title: "删除确认",
        content: "删除后需手动恢复",
        actions: [
          { type: "common", label: "取消" },
          {
            type: "error",
            label: "删除",
            run: () => {
              mainStore.deleteArticle(id.type, id.source).then(() => {
                this.notification.notify({
                  type: "success",
                  title: "删除成功",
                })
                this.router.push({ name: "home" })
              })
            },
          },
        ],
      })
    },
    saveArticle(raw: string) {
      const detailStore = useDetailStore()
      detailStore.saveArticle(raw).then(
        () => {
          this.notification.notify({
            title: "保存成功",
            type: "success",
          })
          this.reloadBlogData()
        },
        (err) => {
          this.notification.notify({
            title: "文章保存失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
    },
    editArticle(id: IArticleIdentifier) {
      this.router.push({ name: "edit", params: { ...id } })
    },
    viewArticle(id: IArticleIdentifier) {
      this.router.push({ name: "view", params: { ...id } })
    },
    getArticle(id: IArticleIdentifier) {
      const detailStore = useDetailStore()
      detailStore.getArticle(id.type, id.source).catch((err) => {
        if (err?.response?.status === 404) {
          this.goHome()
        } else {
          this.notification.notify({
            title: "文章载入失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      })
    },
    goHome() {
      this.router.push({ name: "home" })
    },
    reloadBlogData() {
      const mainStore = useMainStore()
      mainStore.getBlogData().catch((err) => {
        this.notification.notify({
          title: `博客数据刷新失败`,
          desc: (err as Error).message,
          type: "error",
          permanent: true,
          // TODO 支持 action
        })
      })
    },
    loadBlogData() {
      const mainStore = useMainStore()
      mainStore.getBlogData().catch((err) => {
        this.notification.notify({
          title: `博客数据载入失败`,
          desc: (err as Error).message,
          type: "error",
          permanent: true,
          // TODO 支持 action
        })
      })
    },
  },
})
