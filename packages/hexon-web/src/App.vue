<script setup lang="ts">
import account from "./account";
import { useAccountProvider } from "./lib/account";
import { defaultTheme, redTheme } from "./constants";
import { ThemeProvider, useThemeSwitcherProvider } from "./lib/theme";

const switcher = useThemeSwitcherProvider("blue", defaultTheme);
switcher.controller.setTheme("red", redTheme);
const theme = switcher.theme;
useAccountProvider(account);
</script>

<template>
  <ThemeProvider :theme="theme">
    <router-view></router-view>
  </ThemeProvider>
</template>

<style></style>
