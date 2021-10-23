<script setup lang="ts">
import { useRouter } from "vue-router";
import { useDetailStore } from "~/store/detail";

const router = useRouter();
const detailStore = useDetailStore();
router.beforeEach((to) => {
  if (to.name === "view") {
    const { type, source } = to.params;
    detailStore.getArticle({ source, type } as {
      type: "post" | "page";
      source: string;
    });
  }
});
</script>
<template>{{ detailStore.article?.content }}</template>
