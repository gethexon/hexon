<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity"
import HVerticalCenter from "@/ui/vertical-center"
import { HIconName } from "./interface"

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
    <span class="h-icon" :class="classes">{{ name }}</span>
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
