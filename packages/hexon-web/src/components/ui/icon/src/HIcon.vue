<script setup lang="ts">
import { createClassNames } from "~/utils/create-classnames"
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
const { classNames } = createClassNames("h-icon", (add, m) => {
  props.clickable && add(m("clickable"))
})
</script>
<template>
  <HVerticalCenter>
    <span :class="classNames">{{ props.name }}</span>
  </HVerticalCenter>
</template>
<style scoped lang="less">
.h-icon {
  font-family: "Segoe Fluent Icons";
  -webkit-font-smoothing: auto;
  &-clickable {
    @apply cursor-pointer;
  }
}
</style>
