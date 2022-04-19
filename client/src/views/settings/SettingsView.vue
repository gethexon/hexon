<script setup lang="ts">
import type { Ref } from "vue"
import { computed, ref } from "vue"
import { useThemeVars } from "@/ui/theme"
import { HNavList, NavListItem } from "@/ui/nav-list"
import SignoutButton from "./SignoutButton.vue"
import { useNavConfig } from "./nav-config"
import TabSwitcher from "./TabSwitcher.vue"

const vars = useThemeVars()
const activeNavIdx: Ref<number> = ref(0)
const { config, getConfig } = useNavConfig()
const model = computed(() => {
  return [
    {
      type: "title" as const,
      label: "设置",
    } as NavListItem,
    ...config.value.map(
      ({ type, text, icon, color, key }, idx): NavListItem => ({
        type,
        text,
        icon,
        color,
        key,
        selected: activeNavIdx.value === idx,
      })
    ),
  ]
})

const onSelect = (key: string) => {
  switch (key) {
    case "user":
    case "security":
    case "style":
    case "about":
    case "help":
      const next = getConfig(key).idx
      activeNavIdx.value = next
      break
    default:
      break
  }
}
const tabs2 = computed(() => {
  return config.value.map(({ key, text, comp }) => ({ key, title: text, comp }))
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
      :style="{ backgroundColor: vars.backgroundColorSecondary }"
    >
      <TabSwitcher :current="activeNavIdx" :model="tabs2" />
    </div>
  </div>
</template>
