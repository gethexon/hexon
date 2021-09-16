<script setup lang="ts">
import account from "./account";
import { useAccountProvider } from "./lib/account";
import { blueTheme } from "./constants";
import { ThemeProvider, useThemeSwitcherProvider } from "./lib/theme";

const switcher = useThemeSwitcherProvider("blue", blueTheme);
const theme = switcher.theme;
useAccountProvider(account);
</script>

<template>
  <ThemeProvider :theme="theme">
    <router-view></router-view>
  </ThemeProvider>
</template>

<style scoped lang="less">
@import "./reset.less";
</style>
