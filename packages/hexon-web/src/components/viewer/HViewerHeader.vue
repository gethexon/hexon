<script setup lang="ts">
import { computed } from "vue"
import { DATE_FORMAT } from "~/constants"
import { IParsedArticleMeta } from "~/utils/article"
import { HIcon, HIconName } from "@/ui/icon"

const props = defineProps<{
  article: IParsedArticleMeta
}>()
const date = computed(() =>
  props.article.date ? props.article.date.format(DATE_FORMAT) : ""
)
const updated = computed(() =>
  props.article.updated ? props.article.updated.format(DATE_FORMAT) : ""
)
const rest = computed(() => {
  // FIXME
  const data = props.article.fm
  if (JSON.stringify(data) === JSON.stringify({})) return ""
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
})
</script>
<template>
  <div class="h-viewer-header text-base px-5 mx-auto" style="max-width: 768px">
    <h1 class="text-4xl text-main my-5" v-if="article.title">
      {{ article.title }}
    </h1>
    <div class="updated text-sub" v-if="updated">
      <HIcon
        class="mr-1"
        style="transform: translateX(-1px)"
        :name="HIconName.DevUpdate"
      />
      <span>{{ updated }}</span>
    </div>
    <div class="date text-sub" v-if="date">
      <HIcon
        class="mr-1"
        style="transform: translateX(-1px)"
        :name="HIconName.Globe"
      />
      <span>{{ date }}</span>
    </div>
    <div
      class="categories mt-1 text-sm text-sub"
      v-if="article.categories.length"
    >
      <HIcon class="mr-1" :name="HIconName.Folder" />
      <template v-for="(category, index) in article.categories" :key="index">
        <HIcon class="ml-0.5" :name="HIconName.ChevronRight" v-if="index" />
        <span class="ml-0.5">{{ category }}</span>
      </template>
    </div>
    <div class="tags text-sm text-sub mt-1" v-if="article.tags.length">
      <HIcon class="mr-1" :name="HIconName.Tag" />
      <template v-for="(tag, index) in article.tags" :key="index">
        <span v-if="index">,</span>
        <span class="ml-0.5">{{ tag }}</span>
      </template>
    </div>
    <pre class="rest text-sub text-xs" v-if="rest">{{ rest }}</pre>
  </div>
</template>
<style lang="less" scoped></style>
