<script setup lang="ts">
import account from "./account";
import { useAccountProvider } from "./lib/account";
import { useThemeController } from "./lib/theme";
useAccountProvider(account);
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
