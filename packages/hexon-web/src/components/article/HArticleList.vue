<script setup lang="ts">
import { ref, toRefs } from "vue"
import { IHArticleListData, IShowMenuPaylod } from "./interface"
import HArticleItem from "./HArticleItem.vue"
import HArticleMenu from "./HArticleMenu.vue"

const props = defineProps<{
  articles: IHArticleListData[]
  selected?: string
}>()
const emits = defineEmits<{
  (e: "on-click", payload: { source: string; type: "post" | "page" }): void
}>()
const { articles, selected } = toRefs(props)
const position = ref({ x: 0, y: 0 })
const show = ref(false)
const article = ref<IHArticleListData | null>(null)
const onContextMenu = (e: MouseEvent) => {
  position.value.x = e.pageX
  position.value.y = e.pageY
  show.value = true
}
const onShowMenu = (payload: IShowMenuPaylod) => {
  article.value = payload.article
  onContextMenu(payload.e)
}
</script>
<template>
  <div class="h-article-list px-3 py-2">
    <HArticleItem
      v-for="article in articles"
      :article="article"
      :selected="selected === article.source"
      @click="emits('on-click', { source: article.source, type: article.type })"
      @show-menu="onShowMenu"
    ></HArticleItem>
    <HArticleMenu :position="position" v-model:show="show" :article="article" />
  </div>
</template>
