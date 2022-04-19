<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core"
import { MainPart , SidePart , SideSplit } from "@winwin/vue-side-split"
import { nextTick , onMounted , ref } from "vue"
import { RouterView } from "vue-router"
import { useDispatcher } from "~/store/dispatcher"
import preLoadAll from "~/utils/preload"
import ArticleListView from "~/views/ArticleListView.vue"
import HomeNavView from "~/views/HomeNavView.vue"
import { useThemeVars } from "@/ui/theme"
import HSearchBar from "@/HSearchBar.vue"

//#region hooks
const dispatcher = useDispatcher()
//#endregion

onMounted(() => {
  dispatcher.loadBlogData()
  dispatcher.getInfo()
})
const sep = useLocalStorage("index-sep", { nav: 200, list: 320 })

const search = ref("")

const onAdd = () => dispatcher.showCreateArticleModal()

onMounted(() => {
  nextTick(() => {
    preLoadAll()
  })
})
const vars = useThemeVars()
vars.value.backgroundColorTertiary
</script>
<template>
  <SideSplit class="index-page w-full h-full">
    <SidePart :min="150" v-model="sep.nav" :max="300">
      <HomeNavView />
    </SidePart>
    <SidePart :min="200" v-model="sep.list" :max="500">
      <div class="home-list-view flex flex-col w-full h-full">
        <HSearchBar v-model="search" class="flex-shrink-0" @on-add="onAdd" />
        <div class="overflow-auto flex-1">
          <ArticleListView />
        </div>
      </div>
    </SidePart>
    <MainPart type="main">
      <div class="home-viewer-view w-full h-full">
        <RouterView />
      </div>
    </MainPart>
  </SideSplit>
</template>
<style lang="less" scoped>
.home-list-view {
  background-color: v-bind("vars.backgroundColorSecondary");
}
.home-viewer-view {
  background-color: v-bind("vars.backgroundColorPrimary");
}
</style>

<route>
{
  name: "home",
}
</route>
