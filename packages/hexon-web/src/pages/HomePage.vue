<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { useAccount } from "../lib/account";
import { useThemeController, useTheme } from "@winwin/vue-global-theming";
import { GET_BLOG_DATA_ACTION } from "../store/action-types";
import { HTheme } from "../themes";
import { forceReloadWindow } from "../utils";
const store = useStore();
const account = useAccount();
const themeController = useThemeController();
const theme = useTheme<HTheme>();
const onSignOut = async () => {
  await account?.signout();
  forceReloadWindow();
};
const state = computed(() => store.state);
const loadBlogData = async () => {
  await store.dispatch(GET_BLOG_DATA_ACTION);
};
const changeToPurple = () => {
  themeController?.changeTheme("purple");
};
const changeToDefault = () => {
  themeController?.changeTheme("default");
};
const style = computed(() => ({
  backgroundColor: theme?.value.color.primary.n,
}));
</script>
<template>
  <h1>HomePage</h1>
  <button @click="changeToDefault">change default</button>
  <button @click="changeToPurple">change purple</button>
  <button @click="onSignOut">signout</button>
  <button @click="loadBlogData">get blog data</button>
  <pre :style="style">
    {{ theme }}
  </pre>
  <pre>{{ state }}</pre>
</template>
<style scoped>
h1 {
  color: var(--color-primary);
}
</style>
