import { defineStore } from "pinia"
import { defineAsyncComponent } from "vue"
import { ICreateOptions } from "~/api"
import { changePassword, getInfo, login, changeUsername } from "~/api/auth"
import { IChangePasswordFormPayload } from "~/components/forms/interface"
import { getErrorId, getErrorMessage } from "~/errors"
import { IArticleIdentifier } from "~/interface"
import { isPost } from "~/utils/article"
import { useDetailStore } from "./detail"
import { useMainStore } from "./main"
import { useSettingsStore } from "./settings"

const HCreateArticleModal = defineAsyncComponent(
  () => import("@/modals/HCreateArticleModal.vue")
)
const HSettingsModal = defineAsyncComponent(
  () => import("@/modals/HSettingsModal.vue")
)

export const useDispatcher = defineStore("dispatcher", {
  state: () => ({}),
  actions: {
    init() {
      const mainStore = useMainStore()
      mainStore.loadUsername()
    },
    //#region user
    async getInfo() {
      return Promise.all([this.getUsername(), this.getSettings()])
    },
    async getSettings() {
      const settingsStore = useSettingsStore()
      await settingsStore.load()
    },
    async getUsername() {
      const mainStore = useMainStore()
      const { username } = await getInfo()
      mainStore.setUsername(username)
    },
    async signIn({
      username,
      password,
    }: {
      username: string
      password: string
    }) {
      try {
        await login(username, password)
        this.getInfo()
        this.router.push({ name: "home" })
      } catch (e) {
        this.notification.notify({
          title: "登入失敗",
          type: "error",
        })
      }
    },
    async changePassword(payload: IChangePasswordFormPayload) {
      return changePassword(payload.oldPassword, payload.newPassword).then(
        () => {
          this.notification.notify({ type: "success", title: "密碼修改成功" })
        },
        (err) => {
          this.notification.notify({
            title: "密碼修改失敗",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
    },
    async changeUsername(username: string) {
      return changeUsername(username).then(
        () => {
          this.notification.notify({ type: "success", title: "使用者名稱修改成功" })
          return this.getUsername()
        },
        (err) => {
          this.notification.notify({
            title: "使用者名稱修改失敗",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
    },
    //#endregion
    //#region modals
    showCreateArticleModal() {
      this.modal.create(HCreateArticleModal)
    },
    showSettingsModal() {
      this.modal.create(HSettingsModal)
    },
    //#endregion
    async createArticle(title: string, options: ICreateOptions) {
      const mainStore = useMainStore()
      this.loading.start()
      try {
        await mainStore.createArticle(title, options).then(
          () => {
            this.notification.notify({
              type: "success",
              title: "建立成功",
            })
          },
          (err) => {
            this.notification.notify({
              title: "建立失敗",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    deleteArticle(id: IArticleIdentifier) {
      const mainStore = useMainStore()
      this.dialog.create({
        type: "warning",
        title: "確認刪除?",
        content: "刪除後需手動還原",
        actions: [
          { type: "common", label: "取消" },
          {
            type: "error",
            label: "刪除",
            run: () => {
              mainStore.deleteArticle(id.type, id.source).then(() => {
                this.notification.notify({
                  type: "success",
                  title: "刪除成功",
                })
                // FIXME 不是每次都要跳转
                this.router.push({ name: "home" })
              })
            },
          },
        ],
      })
    },
    async saveArticle(raw: string) {
      this.loading.start()
      try {
        const detailStore = useDetailStore()
        await detailStore.saveArticle(raw).then(
          () => {
            this.notification.notify({
              title: "儲存成功",
              type: "success",
            })
            this.reloadBlogData()
          },
          (err) => {
            this.notification.notify({
              title: "文章儲存失敗",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
            throw err
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
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
        if (getErrorId(err) === "PostOrPageNotFoundError") {
          this.goHome()
        } else {
          this.notification.notify({
            title: "文章載入失敗",
            desc: getErrorMessage(err),
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
    async publishArticle(source: string) {
      this.dialog.create({
        type: "warning",
        title: "確認發布?",
        content: "發布後需手動修復",
        actions: [
          { type: "common", label: "取消" },
          {
            type: "info",
            label: "發布",
            run: () => {
              this.doPublishArticle(source)
            },
          },
        ],
      })
    },
    async doPublishArticle(source: string) {
      const prefix = "_drafts/"
      if (!source.startsWith(prefix)) return
      this.loading.start()
      try {
        const removePrefixAndExt = (source: string) => {
          return source.slice(prefix.length, -3)
        }
        const mainStore = useMainStore()
        await mainStore.publishArticle(removePrefixAndExt(source)).then(
          (article) => {
            this.notification.notify({
              title: "發布成功",
              type: "success",
            })
            const detailStore = useDetailStore()
            if (
              detailStore.article &&
              isPost(detailStore.article) &&
              detailStore.article.source === source
            ) {
              this.router.push({
                name: "view",
                params: { source: article.source },
              })
            }
          },
          (err) => {
            this.notification.notify({
              title: "文章發布失敗",
              desc: (err as Error).message,
              type: "error",
              duration: 5000,
            })
          }
        )
      } catch (err) {
      } finally {
        this.loading.stop()
      }
    },
    goHome() {
      this.router.push({ name: "home" })
    },
    reloadBlogData() {
      const mainStore = useMainStore()
      mainStore.getBlogData().catch((err) => {
        this.notification.notify({
          title: `Blog資料重整失敗`,
          desc: (err as Error).message,
          type: "error",
          actions: [
            {
              label: "重試",
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
          title: `Blog資料載入失敗`,
          desc: (err as Error).message,
          type: "error",
          duration: 5000,
        })
      })
    },
  },
})
