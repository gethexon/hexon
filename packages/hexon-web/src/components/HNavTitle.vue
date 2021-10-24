<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useTheme } from "@winwin/vue-global-theming";
import { HTheme } from "~/themes";

const theme = useTheme<HTheme>()!;
const color = computed(() => theme.value.color.foreground.main);
</script>
<template>
  <div class="h-nav-title text-sm select-none font-bold leading-11 px-4">
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
@import "~/styles/mixins.less";
.h-nav-title {
  color: v-bind("color");
  .ellipsis(1);
}
</style>
