<script setup lang="ts">
import { computed } from "@vue/reactivity"
import HNotification from "./components/HNotification/HNotification.vue"
import ClassProvider from "./ClassProvider.vue"
const styles = computed(() => {
  return {
    width: "100vw",
    height: "100vh",
  }
})
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
