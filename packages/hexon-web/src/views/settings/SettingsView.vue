<script setup lang="ts">
import type { Component } from "vue"
import { computed, ref, watch } from "vue"
import { useThemeVars } from "@/ui/theme"
import { HNavList, NavListItem } from "@/ui/nav-list"
import SignoutButton from "./SignoutButton.vue"
import { useNavConfig } from "./nav-config"
import { SettingsTab } from "./interface"
import TabSwitcher from "./TabSwitcher.vue"

const vars = useThemeVars()
const activeNav = ref<SettingsTab>("user")
const up = ref(false)
const { config, getConfig } = useNavConfig()
const model = computed(() => {
  return [
    {
      type: "title" as const,
      label: "设置",
    } as NavListItem,
    ...config.value.map(
      ({ type, text, icon, color, key }): NavListItem => ({
        type,
        text,
        icon,
        color,
        key,
        selected: key === activeNav.value,
      })
    ),
  ]
})

const tabs = ref<
  {
    key: SettingsTab
    comp: Component
  }[]
>([])
watch(
  () => activeNav.value,
  (v) => {
    const { key, comp } = getConfig(v)
    tabs.value = [{ key, comp }]
  },
  {
    immediate: true,
  }
)
const onSelect = (key: string) => {
  switch (key) {
    case "user":
    case "security":
    case "style":
    case "about":
    case "help":
      const next = getConfig(key).idx
      const current = getConfig(activeNav.value).idx
      up.value = next > current
      activeNav.value = key
      break
    default:
      break
  }
}
const tabs2 = computed(() => {
  return config.value.map(({ key, comp }) => ({ key, comp }))
})
</script>
<template>
  <div class="h-full w-full flex rounded-md overflow-hidden">
    <div
      class="w-48 flex-shrink-0 flex flex-col"
      :style="{ backgroundColor: vars.backgroundColorTertiary }"
    >
      <div style="flex: 1 0 0; overflow-y: auto">
        <div class="pb-2 pl-4 pr-2">
          <HNavList :model="model" @on-select="onSelect" />
        </div>
      </div>
      <SignoutButton />
    </div>
    <div
      class="flex-1 overflow-hidden relative"
      :style="{ backgroundColor: vars.backgroundColorPrimary }"
    >
      <TabSwitcher :current="activeNav" :model="tabs2" />
    </div>
  </div>
</template>
