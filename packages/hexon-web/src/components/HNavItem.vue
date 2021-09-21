<script setup lang="ts">
import { toRefs, computed } from "vue";
import type { Component } from "vue";
import HIcon from "./HIcon.vue";

const props = withDefaults(
  defineProps<{
    icon: Component;
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
  <div class="h-nav-item" :class="classes">
    <span style="width: 16px; display: inline-block" v-for="i in indents">
    </span>
    <HIcon style="margin-right: 8px; font-size: large" :style="{ color }">
      <component :is="icon"></component>
    </HIcon>
    <span>
      {{ text }}
    </span>
    <span
      v-if="sub.toString() !== ''"
      style="
        font-size: smaller;
        color: var(--color-foreground-6);
        margin-left: 4px;
      "
    >
      {{ sub }}
    </span>
  </div>
</template>
<style scoped lang="less">
.h-nav-item {
  padding: 2px 16px;
  margin: 2px 0;
  height: 28px;
  border-radius: 6px;
  user-select: none;
  color: var(--color-foreground-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  .selected,
  &:hover {
    background-color: var(--color-background-4);
  }
  &:active {
    background-color: var(--color-background-5);
  }
}
</style>
