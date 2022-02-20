<script setup lang="ts">
import { computed } from "vue"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import { HNavList, NavListItem } from ".."
import { HIconName } from "../../icon"

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
const model: NavListItem[] = [
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
  {
    type: "title",
    label: "筛选",
  },
  {
    type: "item",
    text: "全部",
    icon: HIconName.Home,
    sub: 4,
    color: colors.value.all,
    selected: true,
    key: "all",
  },
  {
    type: "item",
    text: "文章",
    icon: HIconName.Edit,
    sub: 2,
    color: colors.value.post,
    selected: false,
    key: "post",
  },
  {
    type: "item",
    text: "页面",
    icon: HIconName.Page,
    sub: 1,
    color: colors.value.page,
    selected: false,
    key: "page",
  },
  {
    type: "item",
    text: "草稿",
    icon: HIconName.Read,
    sub: 1,
    color: colors.value.draft,
    selected: false,
    key: "draft",
  },
  {
    type: "title",
    label: "分类",
  },
  {
    type: "item",
    text: "分类一",
    indent: 0,
    icon: HIconName.Folder,
    color: t.value.color.folder,
    sub: 3,
    key: "c1",
  },
  {
    type: "item",
    text: "分类二",
    indent: 0,
    icon: HIconName.Folder,
    color: t.value.color.folder,
    sub: 3,
    key: "c2",
  },
  {
    type: "item",
    text: "分类二子",
    indent: 1,
    icon: HIconName.Folder,
    color: t.value.color.folder,
    sub: 1,
    key: "c21",
  },
]
const onSelect = (value: string) => {
  console.log(value, "selected")
}
</script>
<template>
  <div class="bg-base-3" style="display: inline-block; width: 200px">
    <HNavList :model="model" @on-select="onSelect"></HNavList>
  </div>
</template>
