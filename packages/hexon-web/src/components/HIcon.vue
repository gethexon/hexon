<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity"
import { HIconName } from "./HIconName"
import HVerticalCenter from "./HVerticalCenter.vue"

const props = withDefaults(
  defineProps<{
    name: HIconName
    clickable?: boolean
  }>(),
  {
    clickable: false,
  }
)
const { name, clickable } = toRefs(props)
const classes = computed(() => {
  return { clickable: clickable.value }
})
</script>
<template>
  <HVerticalCenter>
    <span class="h-icon select-none" :class="classes">{{ name }}</span>
  </HVerticalCenter>
</template>
<style scoped lang="less">
.h-icon {
  font-family: "Segoe Fluent Icons";
  -webkit-font-smoothing: auto;
  &.clickable {
    @apply cursor-pointer;
  }
}
</style>
