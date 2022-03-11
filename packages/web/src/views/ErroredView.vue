<script setup lang="ts">
import { computed } from "vue-demi"
import { useThemeVars } from "~/components/ui/theme"

const vars = useThemeVars()
const styleVars = computed(() => ({
  color: vars.value.textColorPrimary,
}))
</script>
<template>
  <div
    class="h-errored-view h-full w-full flex flex-col items-center justify-center select-none"
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
