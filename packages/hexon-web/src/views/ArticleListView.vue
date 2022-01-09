<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { BriefPost } from "~/api"
import { IHArticleListData } from "~/components/article/interface"
import { useArticleListStore } from "~/store/articleList"
import { useDispatcher } from "~/store/dispatcher"
import { useMainStore } from "~/store/main"
import { isDraft, isPost } from "~/utils/article"
import HArticleList from "@/article/HArticleList.vue"
import { dateFromString } from "~/utils/date"
//#region hooks
const mainStore = useMainStore()
const route = useRoute()
const dispatcher = useDispatcher()
const articleListStore = useArticleListStore()
//#endregion

const filter = computed(() => articleListStore.articleFilter)
const articles = computed(() => filter.value(mainStore.articles))
const articleListData = computed(() =>
  articles.value.map((article) => {
    const res: IHArticleListData = {
      title: article.title,
      brief: article.brief,
      date: dateFromString(article.date),
      updated: dateFromString(article.updated),
      source: article.source,
      type: isPost(article) ? "post" : "page",
      isDraft: isDraft(article),
      tags: [],
      categories: [],
    }
    if (isPost(article)) {
      res.tags = (article as BriefPost).tags.map(
        (tag) => mainStore.tags[tag].name
      )
      res.categories = (article as BriefPost).categories.map(
        (cat) => mainStore.categories[cat].name
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
  if (source === selected.value) dispatcher.goHome()
  else dispatcher.viewArticle({ source, type })
}
</script>
<template>
  <HArticleList
    :articles="articleListData"
    :selected="selected"
    @on-click="onArticleClick"
  />
</template>
