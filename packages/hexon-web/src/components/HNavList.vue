<script setup lang="ts">
import { toRefs, computed } from "vue"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import { TreeNode } from "~/lib/list2tree"
import { Category } from "~/api"
import HNavTitle from "./ui/nav-list/src/HNavTitle.vue"
import HNavItem from "./ui/nav-list/src/HNavItem.vue"
import { HIconName } from "./ui/icon"
import { HNavListActionPayload } from "./types"

const t = useTheme<HTheme>()
const props = defineProps<{
  categories: TreeNode<Category, "children">[]
  post: number
  page: number
  draft: number
  type: "all" | "post" | "page" | "draft" | "category" | "tag"
}>()
const emits = defineEmits<{
  (e: "on-action", payload: HNavListActionPayload): void
  (e: "on-click", key: string): void
}>()
const { categories, post, page, draft, type } = toRefs(props)
const all = computed(() => post.value + page.value + draft.value)

const data = computed(() => {
  const res: {
    icon: HIconName
    text: string
    indent?: number
    selected?: boolean
    color?: string
    sub?: string | number
    key: string
    slug: string
  }[] = []
  function go(c: TreeNode<Category, "children">, i = 0) {
    res.push({
      text: c.name,
      icon: HIconName.Folder,
      color: t?.value.color.folder,
      indent: i,
      sub: c.posts?.length,
      key: c.slug,
      slug: c.slug,
    })
    c.children?.forEach((child) => go(child, i + 1))
  }
  categories.value.forEach((c) => go(c))
  return res
})
const colors = computed(() => ({
  deploy: t?.value.color.primary.n,
  generate: t?.value.color.primary.n,
  clean: t?.value.color.error.n,
  gitsave: t?.value.color.primary.n,
  gitsync: t?.value.color.error.n,
  all: t?.value.color.all,
  post: t?.value.color.post,
  page: t?.value.color.page,
  draft: t?.value.color.draft,
}))
const onAction = (payload: HNavListActionPayload) => {
  emits("on-action", payload)
}
</script>
<template>
  <div class="py-0 pl-4 pr-2">
    <HNavTitle>操作</HNavTitle>
    <HNavItem
      text="部署"
      :icon="HIconName.Airplane"
      :color="colors.deploy"
      @click="onAction({ type: 'deploy' })"
    ></HNavItem>
    <HNavItem
      text="生成"
      :icon="HIconName.Library"
      :color="colors.generate"
      @click="onAction({ type: 'generate' })"
    ></HNavItem>
    <HNavItem
      text="清理"
      :icon="HIconName.EraseTool"
      :color="colors.clean"
      @click="onAction({ type: 'clean' })"
    ></HNavItem>
    <HNavItem
      text="同步到 Git"
      :icon="HIconName.Upload"
      :color="colors.gitsave"
      @click="onAction({ type: 'gitsave' })"
    ></HNavItem>
    <HNavItem
      text="从 Git 同步"
      :icon="HIconName.Download"
      :color="colors.gitsync"
      @click="onAction({ type: 'gitsync' })"
    ></HNavItem>
    <HNavTitle>筛选</HNavTitle>
    <HNavItem
      text="全部"
      :icon="HIconName.Home"
      :sub="all"
      :color="colors.all"
      :selected="type === 'all'"
      @click="onAction({ type: 'all' })"
    ></HNavItem>
    <HNavItem
      text="文章"
      :icon="HIconName.Edit"
      :sub="post"
      :color="colors.post"
      @click="onAction({ type: 'post' })"
      :selected="type === 'post'"
    ></HNavItem>
    <HNavItem
      text="页面"
      :icon="HIconName.Page"
      :sub="page"
      :color="colors.page"
      @click="onAction({ type: 'page' })"
      :selected="type === 'page'"
    ></HNavItem>
    <HNavItem
      text="草稿"
      :icon="HIconName.Read"
      :sub="draft"
      :color="colors.draft"
      @click="onAction({ type: 'draft' })"
      :selected="type === 'draft'"
    ></HNavItem>
    <HNavTitle>分类</HNavTitle>
    <HNavItem
      :text="d.text"
      :icon="d.icon"
      :indent="d.indent"
      :color="d.color"
      :sub="d.sub"
      @click="onAction({ type: 'category', slug: d.slug })"
      v-for="d in data"
    ></HNavItem>
  </div>
</template>
