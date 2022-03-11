<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue"
import { RouterView } from "vue-router"
import { useDispatcher } from "~/store/dispatcher"
import SplitView from "~/lib/splitview"
import HomeNavView from "~/views/HomeNavView.vue"
import HSearchBar from "@/HSearchBar.vue"
import ArticleListView from "~/views/ArticleListView.vue"
import preLoadAll from "~/utils/preload"

//#region hooks
const dispatcher = useDispatcher()
//#endregion

onMounted(() => {
  dispatcher.loadBlogData()
  dispatcher.getInfo()
})
const sep11 = ref(200)
const sep22 = ref(320)
const config = {
  sep1: {
    min: 150,
    max: 300,
  },
  sep2: {
    min: 200,
    max: 500,
  },
}

const search = ref("")

const onAdd = () => dispatcher.showCreateArticleModal()

onMounted(() => {
  nextTick(() => {
    preLoadAll()
  })
})
</script>
<template>
  <SplitView
    v-model:sep1at="sep11"
    v-model:sep2at="sep22"
    :sep1="config.sep1"
    :sep2="config.sep2"
    class="h-full w-full"
  >
    <template v-slot:first>
      <HomeNavView />
    </template>
    <template v-slot:second>
      <div class="bg-base-2 flex flex-col w-full h-full">
        <HSearchBar v-model="search" class="flex-shrink-0" @on-add="onAdd" />
        <div class="overflow-auto flex-1">
          <ArticleListView />
        </div>
      </div>
    </template>
    <template v-slot:third>
      <div class="bg-base-1 w-full h-full">
        <RouterView />
      </div>
    </template>
  </SplitView>
</template>
