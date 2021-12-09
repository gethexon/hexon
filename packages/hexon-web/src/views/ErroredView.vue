<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { computed } from "vue-demi"
import { HTheme } from "~/themes"

const theme = useTheme<HTheme>()!
const styleVars = computed(() => ({
  color: theme.value.color.foreground.main,
}))
</script>
<template>
  <div
    class="
      h-errored-view h-full
      w-full
      flex flex-col
      items-center
      justify-center
      select-none
    "
  >
    <slot>
      <span class="text-xl">出错啦~</span>
    </slot>
  </div>
</template>
<style lang="less" scoped>
.h-errored-view {
  & > span {
    color: v-bind("styleVars.color");
    opacity: 0.2;
  }
}
</style>
