<script setup lang="ts">
import { useTheme } from "@/ui/theme"
import FadeTransition from "~/components/transitions/FadeTransition.vue"

const props = withDefaults(
  defineProps<{
    loading?: boolean
    overlay?: boolean
  }>(),
  {
    loading: true,
    overlay: false,
  }
)
const theme = useTheme("Loading")

// TODO 加上提示语
</script>
<template>
  <slot v-if="overlay || !loading"></slot>
  <FadeTransition>
    <div v-if="loading" class="h-loading">
      <div class="icon"></div>
    </div>
  </FadeTransition>
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
  background-color: v-bind("theme.background");
  .icon {
    animation: loading 0.5s linear infinite;
    border-width: 2px;
    border-style: solid;
    border-color: v-bind("theme.backgroundColorIcon");
    border-radius: 15px;
    width: 30px;
    height: 30px;
    position: relative;
    &::after {
      content: "";
      border-width: 2px;
      border-style: solid;
      border-color: v-bind("theme.colorPrimary");
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
