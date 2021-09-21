<script setup lang="ts">
import { toRefs, markRaw, computed } from "vue";
import type { Component } from "vue";
import {
  DocumentBulletListClock24Filled,
  News24Filled,
  VehicleTruckProfile24Filled,
  Folder24Filled,
  ArrowUpload24Regular,
  ArrowDownload24Regular,
  PaintBrush24Filled,
  Archive24Filled,
  Document24Filled,
  MailInbox24Filled,
} from "@vicons/fluent";
import { useTheme } from "@winwin/vue-global-theming";
import { HTheme } from "../themes";
import HNavTitle from "./HNavTitle.vue";
import HNavItem from "./HNavItem.vue";

type ActionType =
  | "deploy"
  | "generate"
  | "clean"
  | "gitsave"
  | "gitsync"
  | "all"
  | "post"
  | "page"
  | "draft";

const t = useTheme<HTheme>();
interface ICategoryInfo {
  name: string;
  count: number;
  key: string;
  children?: ICategoryInfo[];
}
const props = defineProps<{
  categories: ICategoryInfo[];
  post: number;
  page: number;
  draft: number;
}>();
const emits = defineEmits<{
  (e: "on-action", type: ActionType): void;
  (e: "on-click", key: string): void;
}>();
const { categories, post, page, draft } = toRefs(props);
const all = computed(() => post.value + page.value + draft.value);

const data = computed(() => {
  const res: {
    icon: Component;
    text: string;
    indent?: number;
    selected?: boolean;
    color?: string;
    sub?: string | number;
    key: string;
  }[] = [];
  function go(c: ICategoryInfo, i = 0) {
    res.push({
      text: c.name,
      icon: markRaw(Folder24Filled),
      color: t?.value.color.folder,
      indent: i,
      sub: c.count,
      key: c.key,
    });
    c.children?.forEach((child) => go(child, i + 1));
  }
  categories.value.forEach((c) => go(c));
  return res;
});
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
}));
const onAction = (type: ActionType) => {
  emits("on-action", type);
};
const onClick = (key: string) => {
  emits("on-click", key);
};
</script>
<template>
  <div style="padding: 0 10px 0 16px">
    <HNavTitle>操作</HNavTitle>
    <HNavItem
      text="部署"
      :icon="markRaw(VehicleTruckProfile24Filled)"
      :color="colors.deploy"
      @click="onAction('deploy')"
    ></HNavItem>
    <HNavItem
      text="生成"
      :icon="markRaw(DocumentBulletListClock24Filled)"
      :color="colors.generate"
      @click="onAction('generate')"
    ></HNavItem>
    <HNavItem
      text="清理"
      :icon="markRaw(PaintBrush24Filled)"
      :color="colors.clean"
      @click="onAction('clean')"
    ></HNavItem>
    <HNavItem
      text="同步到 Git"
      :icon="markRaw(ArrowUpload24Regular)"
      :color="colors.gitsave"
      @click="onAction('gitsave')"
    ></HNavItem>
    <HNavItem
      text="从 Git 同步"
      :icon="markRaw(ArrowDownload24Regular)"
      :color="colors.gitsync"
      @click="onAction('gitsync')"
    ></HNavItem>
    <HNavTitle>筛选</HNavTitle>
    <HNavItem
      text="全部"
      :icon="markRaw(Archive24Filled)"
      :sub="all"
      :color="colors.all"
      @click="onAction('all')"
    ></HNavItem>
    <HNavItem
      text="文章"
      :icon="markRaw(News24Filled)"
      :sub="post"
      :color="colors.post"
      @click="onAction('post')"
    ></HNavItem>
    <HNavItem
      text="页面"
      :icon="markRaw(Document24Filled)"
      :sub="page"
      :color="colors.page"
      @click="onAction('page')"
    ></HNavItem>
    <HNavItem
      text="草稿"
      :icon="markRaw(MailInbox24Filled)"
      :sub="draft"
      :color="colors.draft"
      @click="onAction('draft')"
    ></HNavItem>
    <HNavTitle>分类</HNavTitle>
    <HNavItem
      :text="d.text"
      :icon="d.icon"
      :indent="d.indent"
      :color="d.color"
      :sub="d.sub"
      @click="onClick(d.key)"
      v-for="d in data"
    ></HNavItem>
  </div>
</template>
