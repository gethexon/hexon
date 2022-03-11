<script setup lang="ts">
import { HIcon, HIconName } from "@/ui/icon"
import { useThemeVars } from "@/ui/theme"

defineProps<{
  text: string
}>()
const vars = useThemeVars()
</script>
<template>
  <div
    class="p-4 rounded-md relative flex flex-col"
    style="
      width: 960px;
      max-width: calc(100vw - 100px) !important;
      height: 640px;
      max-height: calc(100vh - 100px) !important;
      letter-spacing: 0.02em;
    "
    :style="{
      backgroundColor: vars.backgroundColorPrimary,
    }"
  >
    <div class="text-md mb-4 font-bold flex items-center">
      <HIcon :name="HIconName.Error" class="mr-2" />
      <span>你的 hexo 报错了</span>
    </div>
    <pre
      :style="{
        color: vars.colorError,
      }"
      class="flex-1 font-mono font-bold p-4 rounded-md overflow-auto bg-black"
      >{{ text }}</pre
    >
  </div>
</template>
