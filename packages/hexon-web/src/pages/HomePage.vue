<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useAccountService } from "../lib/account";
import { GET_BLOG_DATA_ACTION } from "../store/action-types";
const service = useAccountService();
const router = useRouter();
const onSignOut = async () => {
  await service?.signout();
  router.push("/signin");
};
const store = useStore();
const state = computed(() => store.state);
const loadBlogData = async () => {
  await store.dispatch(GET_BLOG_DATA_ACTION);
};
</script>
<template>
  <h1>HomePage</h1>
  <button @click="onSignOut">signout</button>
  <button @click="loadBlogData">get blog data</button>
  <pre>{{ state }}</pre>
</template>
