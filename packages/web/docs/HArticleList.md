# HArticleList

<div class="h-container">
<HArticleList :articles="articles" :selected="selected" @on-click="onSelected"></HArticleList>
</div>

<script setup>
import { ref } from 'vue'
import HArticleList from '../src/components/HArticleList.vue'
import { genArticles } from './helper'
const articles = ref(genArticles(5))
const selected = ref(articles.value[2].slug)
const onSelected = slug => { selected.value = slug }
</script>
<style scope>
.h-container{
  background: var(--color-background-base2);
  width: 300px;
}
</style>
