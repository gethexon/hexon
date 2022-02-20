import { App, computed, ComputedRef, inject, InjectionKey, ref } from "vue"

const key: InjectionKey<Loading> = Symbol("loading")

export interface Loading {
  loading: ComputedRef<boolean>
  start(): void
  stop(): void
  install(app: App): void
}

export function createLoadingPlugin(): Loading {
  let token: NodeJS.Timeout | undefined
  const loading = ref(false)
  return {
    loading: computed(() => loading.value),
    start() {
      token = setTimeout(() => {
        loading.value = true
      }, 500)
    },
    stop() {
      if (token) {
        clearTimeout(token)
        token = undefined
      }
      loading.value = false
    },
    install(app: App) {
      const loading = this
      app.provide(key, loading)
    },
  }
}

export function useLoading() {
  return inject(key)!
}
