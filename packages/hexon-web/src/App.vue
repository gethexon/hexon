<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useThemeController } from "@winwin/vue-global-theming";
const theme = useThemeController();
const styles = computed(() => {
  return {
    ...theme?.styles.value,
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
