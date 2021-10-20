<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity";
import { useTheme } from "@winwin/vue-global-theming";
import { HTheme } from "~/themes";

const props = withDefaults(
  defineProps<{
    color?: string;
    bgColor?: string;
    clickable?: boolean;
  }>(),
  { clickable: false }
);
const { color, bgColor, clickable } = toRefs(props);
const theme = useTheme<HTheme>()!;
const classes = computed(() => ({
  clickable: clickable.value,
}));
const styles = computed(() => ({
  color: color?.value ?? theme.value.color.foreground.c9,
  backgroundColor: bgColor?.value ?? theme.value.color.primary.n,
}));
</script>
<template>
  <span
    class="h-badge px-1.5 py-0.5 rounded text-xs select-none mr-1"
    :class="classes"
    :style="styles"
  >
    <slot></slot>
  </span>
</template>
<style lang="less" scoped>
.h-badge {
  &.clickable {
    @apply cursor-pointer;
  }
}
</style>
