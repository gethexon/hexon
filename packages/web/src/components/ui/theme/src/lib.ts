import { merge } from "lodash-es"
import {
  App,
  computed,
  ComputedRef,
  inject,
  InjectionKey,
  provide,
  Ref,
} from "vue"
import { GlobalOverrides, IGlobalTheme } from "./interface"
import lightTheme from "./themes/light"

export const key: InjectionKey<IThemePlugin> = Symbol("key")

export interface IThemePlugin {
  globalThemeRef: ComputedRef<IGlobalTheme>
  globalOverridesRef: ComputedRef<GlobalOverrides>
  install(app: App): void
}

export function createThemePlugin(): IThemePlugin {
  const globalThemeRef: ComputedRef<IGlobalTheme> = computed(() => lightTheme)
  const globalOverridesRef: ComputedRef<GlobalOverrides> = computed(() => ({}))
  return {
    globalThemeRef,
    globalOverridesRef,
    install(app) {
      const theme = this
      app.provide(key, theme)
    },
  }
}

export function provideThemeOverrides({
  themeRef,
  overridesRef,
}: {
  themeRef?: Ref<IGlobalTheme>
  overridesRef?: Ref<GlobalOverrides>
}) {
  const {
    globalOverridesRef: inheritedOverridesRef,
    globalThemeRef: inheritedThemeRef,
  } = inject(key)!
  const globalOverridesRef: ComputedRef<GlobalOverrides> = overridesRef
    ? computed(() => {
        return merge({}, inheritedOverridesRef.value, overridesRef.value)
      })
    : inheritedOverridesRef
  const globalThemeRef = themeRef ?? inheritedThemeRef
  const provides = { globalOverridesRef, globalThemeRef }
  provide(key, provides)
  return provides
}

export function useTheme<N extends Exclude<keyof IGlobalTheme, "common">>(
  id: N
) {
  const { globalThemeRef, globalOverridesRef } = inject(key)!
  const themeRef = computed(() => {
    const { common } = globalThemeRef.value
    return merge(
      {},
      common,
      globalThemeRef.value[id]?.self(common) as ReturnType<
        IGlobalTheme[N]["self"]
      >,
      globalOverridesRef.value.common,
      globalOverridesRef.value[id] ?? {}
    )
  })
  return themeRef
}

export function useThemeVars() {
  const { globalThemeRef, globalOverridesRef } = inject(key)!
  const themeVarsRef = computed(() => {
    const { common } = globalThemeRef.value
    return { ...common, ...globalOverridesRef.value }
  })
  return themeVarsRef
}
