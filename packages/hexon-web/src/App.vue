<script setup lang="ts">
import { computed } from "@vue/reactivity"
import HNotification from "./components/HNotification/HNotification.vue"
import ClassProvider from "./ClassProvider.vue"
import { useDark } from "@vueuse/core"
import { useThemeController } from "@winwin/vue-global-theming"
import { watch } from "vue"
const styles = computed(() => {
  return {
    width: "100vw",
    height: "100vh",
  }
})
const isDarkRef = useDark()
const controller = useThemeController()!
watch(
  () => isDarkRef.value,
  (isDark) => {
    if (isDark) controller.changeTheme("dark")
    else controller.changeTheme("default")
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div :style="styles">
    <ClassProvider>
      <router-view></router-view>
      <HNotification />
    </ClassProvider>
  </div>
</template>

<style lang="less">
@import "./styles/index.less";
</style>
