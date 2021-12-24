<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"

const props = defineProps<{
  loading: boolean
}>()
const theme = useTheme<HTheme>()!

// TODO loading 切换动画
</script>
<template>
  <div v-if="loading" class="h-loading">
    <div class="icon"></div>
  </div>
  <slot v-else></slot>
</template>
<style lang="less">
.h-loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    animation: loading 0.5s linear infinite;
    border-width: 2px;
    border-style: solid;
    border-color: v-bind("theme.color.primary.a8");
    border-radius: 15px;
    width: 30px;
    height: 30px;
    position: relative;
    &::after {
      content: "";
      border-width: 2px;
      border-style: solid;
      border-color: v-bind("theme.color.primary.n");
      border-radius: 15px;
      clip-path: polygon(50% 0%, 59% 50%, 0% 50%, 0% 0%);
      width: 30px;
      height: 30px;
      position: absolute;
      top: -2px;
      left: -2px;
    }
  }
}
@keyframes loading {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
