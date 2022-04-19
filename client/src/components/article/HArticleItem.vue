<script setup lang="ts">
import { computed, toRefs } from "vue"
import dayjs from "dayjs"
import { HBadge } from "@/ui/badge"
import { HIcon, HIconName } from "@/ui/icon"
import { useThemeVars } from "@/ui/theme"
import { IHArticleListData, IShowMenuPaylod } from "./interface"

const props = withDefaults(
  defineProps<{
    article: IHArticleListData
    selected?: boolean
  }>(),
  { selected: false }
)
const emits = defineEmits<{
  (e: "show-menu", payload: IShowMenuPaylod): void
}>()
const { selected } = toRefs(props)
const formatedDate = computed(() => {
  return dayjs(props.article.date).fromNow()
})
const vars = useThemeVars()
const styleVars = computed(() => {
  return {
    bgColor: selected.value
      ? vars.value.backgroundColorSelected
      : vars.value.backgroundColorTransparent,
    hoverBgColor: vars.value.backgroundColorHover,
    activeBgColor: vars.value.backgroundColorActive,
    briefColor: vars.value.textColorSecondary,
  }
})
const onContextMenu = (e: MouseEvent) => {
  emits("show-menu", {
    article: props.article,
    e,
  })
}
</script>
<template>
  <div
    class="h-article-item px-4 py-2 select-none text-sm rounded-md mb-1"
    @contextmenu.prevent="onContextMenu"
  >
    <div class="title mb-3">
      <HIcon
        class="mr-1"
        :name="HIconName.Page"
        :style="{ color: vars.colorPage }"
        v-if="article.type === 'page'"
      />
      <HIcon
        class="mr-1"
        :name="HIconName.Read"
        :style="{ color: vars.colorDraft }"
        v-if="article.isDraft"
      />
      <span class="font-bold">
        {{ article.title }}
      </span>
    </div>
    <div class="brief text-xs mt-1" v-if="article.brief">
      {{ article.brief }}
    </div>
    <div v-if="article.tags.length" class="mt-0.5">
      <HBadge
        class="mr-1 mb-0.5"
        :color="vars.textColorPrimary"
        :bg-color="vars.backgroundColorBadge"
        v-for="tag in article.tags"
        :key="tag"
      >
        {{ tag }}
      </HBadge>
    </div>
    <div class="date mt-1 text-xs" :style="{ color: vars.colorPrimary }">
      {{ formatedDate }}
    </div>
  </div>
</template>
<style lang="less" scoped>
@import "~/styles/mixins.less";
.h-article-item {
  transition: all 0.2s;
  background-color: v-bind("styleVars.bgColor");
  &:hover {
    background-color: v-bind("styleVars.hoverBgColor");
    cursor: pointer;
  }
  &:active {
    background-color: v-bind("styleVars.activeBgColor");
    cursor: pointer;
  }
  .title {
    .ellipsis(1);
  }
  .brief {
    color: v-bind("styleVars.briefColor");
    .ellipsis(3);
  }
  .date {
    .ellipsis(1);
  }
}
</style>
