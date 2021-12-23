<script setup lang="ts">
import { computed, ref, onMounted } from "vue"
import { RouterView, useRouter, useRoute } from "vue-router"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import SplitView from "~/lib/splitview"
import HTitle from "~/components/HTitle.vue"
import HNavList from "~/components/HNavList.vue"
import { useMainStore } from "~/store/main"
import { useArticleListStore } from "~/store/articleList"
import { HNavListActionPayload } from "~/components/types"
import HSearchBar from "~/components/HSearchBar.vue"
import HArticleList from "~/components/HArticleList.vue"
import HNavSetting from "~/components/HNavSetting.vue"
import { noop } from "~/utils"

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()
const articleListStore = useArticleListStore()
const theme = useTheme<HTheme>()!
const loadBlogData = async () => {
  await mainStore.getBlogData().catch(noop)
}
onMounted(async () => {
  if (mainStore.first) loadBlogData()
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

const categoriesTree = computed(() => mainStore.categoriesTree)
const filter = computed(() => articleListStore.articleFilter)
const articles = computed(() => filter.value(mainStore.articles))
const onFilterAll = () => articleListStore.setFilter({ type: "all" })
const onFilterPost = () => articleListStore.setFilter({ type: "post" })
const onFilterPage = () => articleListStore.setFilter({ type: "page" })
const onFilterDraft = () => articleListStore.setFilter({ type: "draft" })
const onFilterCategory = (slug: string) =>
  articleListStore.setFilter({ type: "category", slug })
const onFilterTag = (slug: string) =>
  articleListStore.setFilter({ type: "tag", slug })
const onNavListAction = (payload: HNavListActionPayload) => {
  switch (payload.type) {
    case "all":
      onFilterAll()
      break
    case "post":
      onFilterPost()
      break
    case "page":
      onFilterPage()
      break
    case "draft":
      onFilterDraft()
      break
    case "category":
      onFilterCategory(payload.slug)
      break
    default:
      break
  }
}
const draftsCount = computed(() => mainStore.draftsList.length)
const postsCount = computed(() => mainStore.publishedPostsList.length)
const pagesCount = computed(() => mainStore.pagesList.length)
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
      type: article.__post ? "post" : "page",
    }
    if (article.__post) {
      res.tags = article.tags.map((tag) => mainStore.tags[tag].name)
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
const articleList = useArticleListStore()
const type = computed(() => articleList.filter.type)
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
      <div class="bg-base3 w-full h-full flex flex-col">
        <HTitle />
        <div style="flex: 1 0 0; overflow-y: auto">
          <!-- 这层 div 用来滚动 -->
          <HNavList
            :categories="categoriesTree"
            :page="pagesCount"
            :post="postsCount"
            :draft="draftsCount"
            :type="type"
            @on-action="onNavListAction"
          />
        </div>
        <HNavSetting />
      </div>
    </template>
    <template v-slot:second>
      <div class="bg-base2 flex flex-col w-full h-full">
        <HSearchBar v-model="search" class="flex-shrink-0" />
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
      <div class="bg-base1 w-full h-full">
        <RouterView />
      </div>
    </template>
  </SplitView>
</template>
