<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { RouterView, useRoute, useRouter } from "vue-router"
import { BriefPost } from "~/api"
import { useArticleListStore } from "~/store/articleList"
import { useDispatcher } from "~/store/dispatcher"
import { useMainStore } from "~/store/main"
import { isPost } from "~/utils/article"
import SplitView from "~/lib/splitview"
import HomeNavView from "~/views/HomeNavView.vue"
import HArticleList from "@/HArticleList.vue"
import HSearchBar from "@/HSearchBar.vue"

//#region hooks
const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()
const dispatcher = useDispatcher()
const articleListStore = useArticleListStore()
//#endregion

onMounted(() => {
  dispatcher.loadBlogData()
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

const filter = computed(() => articleListStore.articleFilter)
const articles = computed(() => filter.value(mainStore.articles))
const search = ref("")
const articleListData = computed(() =>
  articles.value.map((article) => {
    const res: {
      title: string
      brief?: string
      tags?: string[]
      date: string
      source: string
      type: "post" | "page"
    } = {
      title: article.title,
      brief: article.brief,
      date: article.date,
      source: article.source,
      type: isPost(article) ? "post" : "page",
    }
    if (isPost(article)) {
      res.tags = (article as BriefPost).tags.map(
        (tag) => mainStore.tags[tag].name
      )
    }
    return res
  })
)
const selected = computed(() =>
  decodeURIComponent(route.params.source as string)
)
const onArticleClick = ({
  source,
  type,
}: {
  source: string
  type: "post" | "page"
}) => {
  if (source === selected.value) router.push("/")
  else
    router.push({
      name: "view",
      params: { source, type },
    })
}

const onAdd = () => dispatcher.showCreateArticleModal()
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
          <HArticleList
            :articles="articleListData"
            :selected="selected"
            @on-click="onArticleClick"
          />
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
