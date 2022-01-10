import { defineStore } from "pinia"
import { api } from "~/api"
import { useDispatcher } from "./dispatcher"

export const useActionsStore = defineStore("actions", {
  actions: {
    async deploy() {
      this.loading.start()
      await api.deploy().then(
        () => {
          this.notification.notify({
            type: "success",
            title: "成功",
          })
        },
        (err) => {
          this.notification.notify({
            title: "失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
          throw err
        }
      )
      this.loading.stop()
    },
    async generate() {
      this.loading.start()
      await api.generate().then(
        () => {
          this.notification.notify({
            type: "success",
            title: "成功",
          })
        },
        (err) => {
          console.error(err)
          this.notification.notify({
            title: "失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
      this.loading.stop()
    },
    async clean() {
      this.loading.start()
      await api.clean().then(
        () => {
          this.notification.notify({
            type: "success",
            title: "成功",
          })
        },
        (err) => {
          console.error(err)
          this.notification.notify({
            title: "失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
      this.loading.stop()
    },
    async gitSync() {
      this.loading.start()
      await api.gitSync().then(
        () => {
          this.notification.notify({
            type: "success",
            title: "成功",
          })
          const dispatcher = useDispatcher()
          dispatcher.loadBlogData()
        },
        (err) => {
          this.notification.notify({
            title: "失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
      this.loading.stop()
    },
    async gitSave() {
      this.loading.start()
      await api.gitSave().then(
        () => {
          this.notification.notify({
            type: "success",
            title: "成功",
          })
          const dispatcher = useDispatcher()
          dispatcher.loadBlogData()
        },
        (err) => {
          this.notification.notify({
            title: "失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
      this.loading.stop()
    },
  },
})
