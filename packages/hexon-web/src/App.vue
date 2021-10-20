<script setup lang="ts">
import { computed } from "@vue/reactivity";
const styles = computed(() => {
  return {
    width: "100vw",
    height: "100vh",
  };
});
</script>

<template>
  <div :style="styles">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import "./styles/index.less";
</style>
