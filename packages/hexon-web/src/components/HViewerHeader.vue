<script setup lang="ts">
import { computed, toRefs } from "vue"
import { parse } from "hexo-front-matter"
import { categories2Array2d, isMultiCategories } from "~/utils"
import { HIcon } from "./ui/icon"
import { HIconName } from "./ui/icon"
import dayjs from "dayjs"

const props = withDefaults(
  defineProps<{
    title: string
    raw: string
  }>(),
  { title: "", raw: "" }
)
const { title, raw } = toRefs(props)
const all = computed(() => parse(raw.value))
const fm = computed(() => {
  const { _content, categories, tags, date, updated, title, ...rest } =
    all.value
  return {
    _content,
    categories: categories || [],
    tags: tags || [],
    date,
    updated,
    title,
    rest,
  }
})
const date = computed(() =>
  fm.value.date ? dayjs(fm.value.date as number).format("lll") : ""
)
const updated = computed(() =>
  fm.value.updated ? dayjs(fm.value.updated as number).format("lll") : ""
)
const categories2d = computed(() =>
  categories2Array2d(fm.value.categories as string[] | (string | string[])[])
)
const tags = computed(() => fm.value.tags as string[])
const rest = computed(() => {
  const data = fm.value.rest
  if (JSON.stringify(data) === JSON.stringify({})) return ""
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")
})
</script>
<template>
  <div class="h-viewer-header text-base px-5 mx-auto" style="max-width: 768px">
    <h1 class="text-4xl text-main my-5" v-if="title">{{ title }}</h1>
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
    <template v-for="categories in categories2d" :key="categories">
      <div class="categories mt-1 text-sm text-sub">
        <HIcon class="mr-1" :name="HIconName.Folder" />
        <template v-for="(category, index) in categories" :key="index">
          <HIcon class="ml-0.5" :name="HIconName.ChevronRight" v-if="index" />
          <span class="ml-0.5">{{ category }}</span>
        </template>
      </div>
    </template>
    <div class="tags text-sm text-sub mt-1" v-if="tags.length">
      <HIcon class="mr-1" :name="HIconName.Tag" />
      <template v-for="(tag, index) in tags" :key="index">
        <span v-if="index">,</span>
        <span class="ml-0.5">{{ tag }}</span>
      </template>
    </div>
    <pre class="rest text-sub text-xs" v-if="rest">{{ rest }}</pre>
  </div>
</template>
<style lang="less" scoped></style>
