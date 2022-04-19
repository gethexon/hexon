<script setup lang="ts">
import type { ISlideViewItem } from "@/ui/slide-view"
import { computed, markRaw, ref } from "vue"
import InstallView from "~/views/InstallView.vue"
import InstallWelcomeView from "~/views/InstallWelcomeView.vue"
import { useThemeVars } from "@/ui/theme"
import HSlideView from "@/ui/slide-view/src/HSlideView.vue"
const vars = useThemeVars()
const styleVars = computed(() => {
  return {
    bgColor: vars.value.colorPrimary,
    color: vars.value.textColorWhite,
  }
})
const current = ref(0)
const models: ISlideViewItem[] = [
  {
    component: markRaw(InstallWelcomeView),
  },
  {
    component: markRaw(InstallView),
  },
]
</script>
<template>
  <div class="h-full w-full" :style="{ backgroundColor: vars.colorPrimary }">
    <HSlideView :model="models" v-model:current="current" horizontal />
  </div>
</template>
<style lang="less" scoped>
.install-page {
  background-color: v-bind("styleVars.bgColor");
  color: v-bind("styleVars.color");
}
</style>

<route lang="yaml">
meta:
  name: install
  layout: unauthorized
</route>
