import { resolve } from "path"
import { reactive, computed } from "@vue/reactivity"
import {
  createStoreCreator,
  JSONdbStorageAdapter,
} from "@winwin/server-reactive-store"
export const ROOT = resolve(process.cwd(), "data")
export const NAME = "database.json"

const createStore = createStoreCreator(new JSONdbStorageAdapter(ROOT, NAME))

export const scriptStore = createStore("script", () => {
  const state = reactive<{ items: Record<string, { value: string }> }>({
    items: {},
  })
  const keys = computed(() => Object.keys(state.items))
  const getScript = (key: string) => state.items[key]?.value || ""
  const hasScript = (key: string) => state.items[key]?.value
  const setScript = (key: string, script: string) => {
    state.items[key] = { value: script }
  }
  return { state, keys, getScript, setScript, hasScript }
})