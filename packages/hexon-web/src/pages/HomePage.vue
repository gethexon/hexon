<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useAccountService } from "../lib/account";
import { useThemeController, useTheme } from "../lib/theme";
import { GET_BLOG_DATA_ACTION } from "../store/action-types";
import { HTheme } from "../themes";
import { forceReloadWindow } from "../utils";
const service = useAccountService();
const onSignOut = async () => {
  await service?.signout();
  forceReloadWindow();
};
const store = useStore();
const state = computed(() => store.state);
const loadBlogData = async () => {
  await store.dispatch(GET_BLOG_DATA_ACTION);
};
const themeController = useThemeController();
const changeToPurple = () => {
  themeController?.changeTheme("purple");
};
const changeToDefault = () => {
  themeController?.changeTheme("default");
};
const theme = useTheme<HTheme>();
const style = computed(() => ({
  backgroundColor: theme?.value.color.primary.n,
}));
</script>
<template>
  <h1>HomePage</h1>
  <button @click="changeToDefault">change default</button>
  <button @click="changeToPurple">change purple</button>
  <pre :style="style">
    {{ theme }}
  </pre>
  <button @click="onSignOut">signout</button>
  <button @click="loadBlogData">get blog data</button>
  <pre>{{ state }}</pre>
</template>
<style scoped>
h1 {
  color: var(--color-primary);
}
</style>
