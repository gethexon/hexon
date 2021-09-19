<script setup lang="ts">
import { useThemeController } from "./lib/theme";
const theme = useThemeController();
const styles = theme?.styles;
</script>

<template>
  <div :style="styles">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import "./styles/reset.less";
</style>
