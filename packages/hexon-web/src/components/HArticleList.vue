<script setup lang="ts">
import { toRefs } from "vue-demi";
import HArticleItem from "./HArticleItem.vue";

const props = defineProps<{
  articles: {
    title: string;
    brief?: string;
    tags: string[];
    date: string;
    slug: string;
  }[];
  selected?: string;
}>();
const emits = defineEmits<{
  (e: "on-click", slug: string): void;
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
      :key="article.slug"
      :selected="selected === article.slug"
      @click="emits('on-click', article.slug)"
    ></HArticleItem>
  </div>
</template>
