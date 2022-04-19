import { merge } from "lodash-es"
import { App, computed, inject, InjectionKey, onMounted, Ref, ref } from "vue"
import { IGlobalTheme } from "./interface"
import { lightTheme } from "./themes/light"

export const key: InjectionKey<IThemePlugin> = Symbol("key")

export interface IThemePlugin {
  globalThemeRef: Ref<IGlobalTheme>
  setTheme: (theme: IGlobalTheme) => void
  setGlobal: () => void
  install(app: App): void
}

export function createThemePlugin(): IThemePlugin {
  const globalThemeRef: Ref<IGlobalTheme> = ref(lightTheme)
  const setTheme = (theme: IGlobalTheme) => {
    globalThemeRef.value = theme
    setGlobal()
  }
  const setGlobal = () => {
    const theme = globalThemeRef.value
    document.body.style.backgroundColor = theme.common.backgroundColorTertiary
    document.body.style.color = theme.common.textColorPrimary
  }
  return {
    globalThemeRef,
    setTheme,
    setGlobal,
    install(app) {
      const theme = this
      app.provide(key, theme)
      app.mixin({
        mounted() {
          setGlobal()
        },
      })
    },
  }
}

export function useThemeController() {
  const { setTheme, setGlobal } = inject(key)!
  return { setTheme, setGlobal }
}

export function useTheme<N extends Exclude<keyof IGlobalTheme, "common">>(
  id: N
) {
  const { globalThemeRef } = inject(key)!
  const themeRef = computed(() => {
    const { common } = globalThemeRef.value
    return merge(
      {},
      common,
      globalThemeRef.value[id]?.self(common) as ReturnType<
        IGlobalTheme[N]["self"]
      >
    )
  })
  return themeRef
}

export function useThemeVars() {
  const { globalThemeRef } = inject(key)!
  const themeVarsRef = computed(() => {
    const { common } = globalThemeRef.value
    return { ...common }
  })
  return themeVarsRef
}
