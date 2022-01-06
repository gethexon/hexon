<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { ComputedRef, computed } from "vue"
import { Category } from "~/api"
import { TreeNode } from "~/lib/list2tree"
import { useArticleListStore } from "~/store/articleList"
import { useDispatcher } from "~/store/dispatcher"
import { useMainStore } from "~/store/main"
import { HTheme } from "~/themes"
import { HIconName } from "@/ui/icon"
import { HNavList, NavListItem } from "@/ui/nav-list"
import HNavSetting from "@/HNavSetting.vue"
import HTitle from "@/HTitle.vue"

//#region hooks
const mainStore = useMainStore()
const articleListStore = useArticleListStore()
const dispatcher = useDispatcher()
//#endregion

const t = useTheme<HTheme>()!
const colors = computed(() => ({
  deploy: t.value.color.primary.n,
  generate: t.value.color.primary.n,
  clean: t.value.color.error.n,
  gitsave: t.value.color.primary.n,
  gitsync: t.value.color.error.n,
  all: t.value.color.all,
  post: t.value.color.post,
  page: t.value.color.page,
  draft: t.value.color.draft,
}))

//#region action
const actionItems: NavListItem[] = [
  { type: "title", label: "操作" },
  {
    type: "item",
    text: "部署",
    icon: HIconName.Airplane,
    color: colors.value.deploy,
    key: "deploy",
  },
  {
    type: "item",
    text: "生成",
    icon: HIconName.Library,
    color: colors.value.generate,
    key: "generate",
  },
  {
    type: "item",
    text: "清理",
    icon: HIconName.EraseTool,
    color: colors.value.clean,
    key: "clean",
  },
  {
    type: "item",
    text: "同步到 Git",
    icon: HIconName.Upload,
    color: colors.value.gitsave,
    key: "gitsave",
  },
  {
    type: "item",
    text: "从 Git 同步",
    icon: HIconName.Download,
    color: colors.value.gitsync,
    key: "gitsync",
  },
]
//#endregion

//#region filter
const allCount = computed(
  () => draftsCount.value + postsCount.value + pagesCount.value
)
const postsCount = computed(() => mainStore.publishedPostsList.length)
const pagesCount = computed(() => mainStore.pagesList.length)
const draftsCount = computed(() => mainStore.draftsList.length)
const type = computed(() => articleListStore.filter.type)
const filterItems: ComputedRef<NavListItem[]> = computed(() => [
  {
    type: "title",
    label: "筛选",
  },
  {
    type: "item",
    text: "全部",
    icon: HIconName.Home,
    sub: allCount.value,
    color: colors.value.all,
    selected: type.value === "all",
    key: "all",
  },
  {
    type: "item",
    text: "文章",
    icon: HIconName.Edit,
    sub: postsCount.value,
    color: colors.value.post,
    selected: type.value === "post",
    key: "post",
  },
  {
    type: "item",
    text: "页面",
    icon: HIconName.Page,
    sub: pagesCount.value,
    color: colors.value.page,
    selected: type.value === "page",
    key: "page",
  },
  {
    type: "item",
    text: "草稿",
    icon: HIconName.Read,
    sub: draftsCount.value,
    color: colors.value.draft,
    selected: type.value === "draft",
    key: "draft",
  },
])
//#endregion

//#region category
const categoryItems: ComputedRef<NavListItem[]> = computed(() => {
  const res: NavListItem[] = [{ type: "title", label: "分类" }]
  function go(c: TreeNode<Category, "children">, i = 0) {
    res.push({
      type: "item",
      text: c.name,
      icon: HIconName.Folder,
      color: t?.value.color.folder,
      indent: i,
      sub: c.posts?.length,
      key: "c-" + c.slug,
      selected:
        articleListStore.filter.type === "category" &&
        c.slug === articleListStore.filter.slug,
    })
    c.children?.forEach((child) => go(child, i + 1))
  }
  mainStore.categoriesTree.forEach((c) => go(c))
  return res
})
//#endregion

const model = computed(() => [
  ...actionItems,
  ...filterItems.value,
  ...categoryItems.value,
])
const onSelect = (key: string) => {
  key === "all" && articleListStore.setFilter({ type: "all" })
  key === "post" && articleListStore.setFilter({ type: "post" })
  key === "page" && articleListStore.setFilter({ type: "page" })
  key === "draft" && articleListStore.setFilter({ type: "draft" })
  if (key.slice(0, 2) === "c-")
    articleListStore.setFilter({ type: "category", slug: key.slice(2) })
}
const onSettings = () => dispatcher.showSettingsModal()
</script>
<template>
  <div class="bg-base-3 w-full h-full flex flex-col">
    <HTitle />
    <div style="flex: 1 0 0; overflow-y: auto">
      <div class="pb-2 pl-4 pr-2">
        <HNavList :model="model" @on-select="onSelect" />
      </div>
    </div>
    <HNavSetting @click="onSettings" />
  </div>
</template>
