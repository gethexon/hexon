# HArticleItem

## 基础

<div class="h-container">
<HArticleItem :title="title" :brief="brief" :tags="tags" :date="date"></HArticleItem>
<HArticleItem :title="title" :brief="brief" :tags="tags" :date="date"></HArticleItem>
<HArticleItem :title="title" :brief="brief" :tags="tags" :date="date"></HArticleItem>
</div>

## 选中

<div class="h-container">
<HArticleItem :title="title" :brief="brief" :tags="tags" :date="date" selected></HArticleItem>
<HArticleItem :title="title" :brief="brief" :tags="tags" :date="date"></HArticleItem>
<HArticleItem :title="title" :brief="brief" :tags="tags" :date="date"></HArticleItem>
</div>

## 没有简介

<div class="h-container">
<HArticleItem :title="title" :tags="tags" :date="date"></HArticleItem>
<HArticleItem :title="title" :tags="tags" :date="date"></HArticleItem>
<HArticleItem :title="title" :tags="tags" :date="date"></HArticleItem>
</div>

## 没有标签

<div class="h-container">
<HArticleItem :title="title" :brief="brief" :date="date"></HArticleItem>
<HArticleItem :title="title" :brief="brief" :date="date"></HArticleItem>
<HArticleItem :title="title" :brief="brief" :date="date"></HArticleItem>
</div>

<script setup>
import HArticleItem from '../src/components/HArticleItem.vue'
import { genArticle } from './helper'
const { title, brief, tags, date} = genArticle()
</script>
<style scope>
.h-container{
  background: var(--color-background-c2);
  width: 300px;
  padding: 10px
}
</style>
