import { defineStore } from "pinia"
import { api } from "~/api"
import { getErrorMessage } from "~/errors"
import notification from "~/plugins/notification"
import { useDispatcher } from "./dispatcher"
function success() {
  notification.notify({
    type: "success",
    title: "成功",
  })
}
function fail(e: unknown) {
  const err = e instanceof Error ? e : new Error(e as any)
  console.log(getErrorMessage(err))
  const id = notification.notify({
    title: "失败",
    desc: getErrorMessage(err),
    type: "error",
    actions: [
      {
        label: "好的",
        run() {
          notification.close(id)
        },
      },
    ],
  })
  return err
}
export const useActionsStore = defineStore("actions", {
  actions: {
    async deploy() {
      this.loading.start()
      await api.deploy().then(success, fail)
      this.loading.stop()
    },
    async generate() {
      this.loading.start()
      await api.generate().then(success, fail)
      this.loading.stop()
    },
    async generateAndDeploy(){
      this.loading.start()
      await api.generate({deploy:true}).then()
      await api.deploy().then(success, fail)
      this.loading.stop()
    },
    async clean() {
      this.loading.start()
      await api.clean().then(success, fail)
      this.loading.stop()
    },
    async gitSync() {
      this.loading.start()
      await api.gitSync().then(() => {
        success()
        const dispatcher = useDispatcher()
        dispatcher.loadBlogData()
      }, fail)
      this.loading.stop()
    },
    async gitSave() {
      this.loading.start()
      await api.gitSave().then(() => {
        success()
        const dispatcher = useDispatcher()
        dispatcher.loadBlogData()
      }, fail)
      this.loading.stop()
    },
    async says(){
      const dispatcher = useDispatcher()
      dispatcher.goSays()
      return true
    },
  },
})
