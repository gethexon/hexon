<script setup lang="ts">
import { toRefs } from "vue";
import HArticleItem from "./HArticleItem.vue";

const props = defineProps<{
  articles: {
    type: "post" | "page";
    title: string;
    brief?: string;
    tags?: string[];
    date: string;
    source: string;
  }[];
  selected?: string;
}>();
const emits = defineEmits<{
  (e: "on-click", payload: { source: string; type: "post" | "page" }): void;
}>();
const { articles, selected } = toRefs(props);
</script>
<template>
  <div class="h-article-list px-3 py-2">
    <HArticleItem
      v-for="article in articles"
      :title="article.title"
      :brief="article.brief"
      :tags="article.tags"
      :date="article.date"
      :key="article.source"
      :selected="selected === article.source"
      @click="emits('on-click', { source: article.source, type: article.type })"
    ></HArticleItem>
  </div>
</template>
