<script setup lang="ts">
import { toRefs, computed } from "vue";
import HIcon from "./HIcon.vue";
import { HIconName } from "./HIconName";

const props = withDefaults(
  defineProps<{
    icon: HIconName;
    text: string;
    indent?: number;
    selected?: boolean;
    color?: string;
    sub?: string | number;
  }>(),
  { indent: 0, selected: false, sub: "" }
);
const { icon, text, indent, selected, color } = toRefs(props);
const indents = computed(() => {
  if (indent.value === 0) return [];
  else return new Array(indent.value).fill(0).map((v, i) => i);
});
const classes = computed(() => ({ selected: selected.value }));
</script>
<template>
  <div
    class="
      h-nav-item
      px-4
      py-0.5
      mx-0
      my-0.5
      h-7
      rounded-md
      select-none
      cursor-pointer
      flex
      items-center
    "
    :class="classes"
  >
    <span class="w-4 inline-block" v-for="i in indents"> </span>
    <HIcon class="mr-3 text-lg" :style="{ color }" :name="icon" />
    <span class="text text-sm">
      {{ text }}
    </span>
    <span v-if="sub?.toString()" class="sub text-xs ml-2">
      {{ sub }}
    </span>
  </div>
</template>
<style scoped lang="less">
@import "../styles/mixins.less";
.h-nav-item {
  color: var(--color-foreground-2);
  transition: all 0.2s ease;

  .sub {
    color: var(--color-foreground-6);
  }

  .selected,
  &:hover {
    background-color: var(--color-background-4);
  }
  &:active {
    background-color: var(--color-background-5);
  }
  .text {
    .ellipsis(1);
  }
}
</style>
