import { defineStore } from "pinia"
import { defineAsyncComponent } from "vue"
import { ICreateOptions } from "~/api"
import { IArticleIdentifier } from "~/interface"
import { useDetailStore } from "./detail"
import { useMainStore } from "./main"

const HCreateArticleModal = defineAsyncComponent(
  () => import("@/modals/HCreateArticleModal.vue")
)
const HSettingsModal = defineAsyncComponent(
  () => import("@/modals/HSettingsModal.vue")
)

export const useDispatcher = defineStore("dispatcher", {
  state: () => ({}),
  actions: {
    //#region modals
    showCreateArticleModal() {
      this.modal.create(HCreateArticleModal)
    },
    showSettingsModal() {
      this.modal.create(HSettingsModal)
    },
    //#endregion
    createArticle(title: string, options: ICreateOptions) {
      const mainStore = useMainStore()
      mainStore.createArticle(title, options).then(() => {
        this.notification.notify({
          type: "success",
          title: "新建成功",
        })
      })
    },
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
    async saveArticle(raw: string) {
      const detailStore = useDetailStore()
      await detailStore.saveArticle(raw).then(
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
          throw err
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
    clearArticle() {
      const detailStore = useDetailStore()
      detailStore.clearArticle()
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
          actions: [
            {
              label: "重试",
              run: () => {
                this.reloadBlogData()
              },
            },
          ],
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
