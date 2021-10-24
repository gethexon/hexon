<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming";
import { computed, toRefs } from "vue";
import { HTheme } from "~/themes";
import HBadge from "./HBadge.vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const props = withDefaults(
  defineProps<{
    title: string;
    brief?: string;
    tags?: string[];
    date: string;
    selected?: boolean;
  }>(),
  { selected: false }
);
const { title, brief, tags, date, selected } = toRefs(props);
const formatedDate = computed(() => {
  return dayjs(date.value).fromNow();
});
const theme = useTheme<HTheme>()!;
const styleVars = computed(() => {
  return {
    bgColor: selected.value
      ? theme.value.color.background.selected
      : theme.value.color.background.transparent,
    hoverBgColor: theme.value.color.background.hover,
    activeBgColor: theme.value.color.background.active,
    titleColor: theme.value.color.foreground.main,
    briefColor: theme.value.color.foreground.sub,
  };
});
</script>
<template>
  <div class="h-article-item px-4 py-2 select-none text-sm rounded-md mb-1">
    <div class="title font-bold">{{ title }}</div>
    <div class="brief text-xs mt-1" v-if="brief">{{ brief }}</div>
    <div v-if="tags && tags.length" class="mt-0.5">
      <HBadge
        :color="theme.color.foreground.main"
        :bg-color="theme.color.background.badge"
        v-for="tag in tags"
        :key="tag"
      >
        {{ tag }}
      </HBadge>
    </div>
    <div class="date mt-1 text-xs" :style="{ color: theme.color.primary.n }">
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
    color: v-bind("styleVars.titleColor");
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
