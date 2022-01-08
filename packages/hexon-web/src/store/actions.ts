import { defineStore } from "pinia"
import { api } from "~/api"

export const useActionsStore = defineStore("actions", {
  actions: {
    async deploy() {
      await api.deploy()
    },
    async generate() {
      await api.generate()
    },
    async clean() {
      await api.clean()
    },
    async gitSync() {},
    async gitSave() {},
  },
})
