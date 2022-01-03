<script setup lang="ts">
import { useThemeVars } from "@/ui/theme"
import { HNavList, NavListItem } from "@/ui/nav-list"
import { HIconName } from "@/ui/icon"
import SignoutButton from "./SignoutButton.vue"

const vars = useThemeVars()
const nav: NavListItem[] = [
  {
    type: "title",
    label: "设置",
  },
  {
    type: "item",
    text: "用户",
    icon: HIconName.Contact,
    color: vars.value.colorSuccess,
    key: "user",
  },
  {
    type: "item",
    text: "安全",
    icon: HIconName.ReportHacked,
    color: vars.value.colorPrimary,
    key: "security",
  },
  {
    type: "item",
    text: "样式",
    icon: HIconName.OEM,
    color: vars.value.colorWarning,
    key: "style",
  },
  {
    type: "item",
    text: "关于",
    icon: HIconName.Info,
    color: vars.value.textColorSecondary,
    key: "about",
  },
  {
    type: "item",
    text: "帮助",
    icon: HIconName.EaseOfAccess,
    color: vars.value.textColorSecondary,
    key: "help",
  },
]
</script>
<template>
  <div class="h-full w-full flex rounded-md overflow-hidden">
    <div
      class="w-48 flex-shrink-0 flex flex-col"
      :style="{ backgroundColor: vars.backgroundColorTertiary }"
    >
      <div style="flex: 1 0 0; overflow-y: auto">
        <div class="pb-2 pl-4 pr-2">
          <HNavList :model="nav" />
        </div>
      </div>
      <SignoutButton />
    </div>
    <div
      class="flex-1"
      :style="{ backgroundColor: vars.backgroundColorPrimary }"
    ></div>
  </div>
</template>
