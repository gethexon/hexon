<script setup lang="ts">
import type { ISlideViewItem } from "@/ui/slide-view"
import { useTheme } from "@winwin/vue-global-theming"
import { computed, markRaw, ref } from "vue"
import { HTheme } from "~/themes"
import InstallView from "~/views/InstallView.vue"
import InstallWelcomeView from "~/views/InstallWelcomeView.vue"
import { useThemeVars } from "@/ui/theme"
import HSlideView from "@/ui/slide-view/src/HSlideView.vue"
const theme = useTheme<HTheme>()!
const styleVars = computed(() => {
  return {
    bgColor: theme.value.color.primary.n,
    color: theme.value.color.white,
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
const vars = useThemeVars()
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
