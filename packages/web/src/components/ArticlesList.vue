<template>
  <q-scroll-area
    class="q-pb-xs"
    :thumb-style="{ width: '6px', borderRadius: '3px' }"
  >
    <q-list class="article-list">
      <article-item
        v-for="article in articles"
        :key="article._id + article.__page"
        :article="article"
      ></article-item>
    </q-list>
  </q-scroll-area>
</template>

<script>
import ArticleItem from "src/components/ArticleItem";
export default {
  name: "ArticlesList",
  props: {
    articles: Array
  },
  components: {
    ArticleItem
  }
};
</script>

<style></style>
