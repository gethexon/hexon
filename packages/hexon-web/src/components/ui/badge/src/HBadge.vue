<script setup lang="ts">
import { computed, toRefs } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { useThemeVars } from "@/ui/theme"

const props = withDefaults(
  defineProps<{
    color?: string
    bgColor?: string
    clickable?: boolean
    rounded?: boolean
  }>(),
  { clickable: false, rounded: false }
)
const vars = useThemeVars()
const { color, bgColor } = toRefs(props)
const styles = computed(() => ({
  color: color?.value ?? vars.value.textColorBack,
  backgroundColor: bgColor?.value ?? vars.value.colorPrimary,
}))
const { classNames } = createClassNames("h-badge", (add, m) => {
  props.clickable && add(m("clickable"))
  props.rounded && add(m("rounded"))
})
</script>
<template>
  <span
    class="px-1 py-0.5 select-none inline-block"
    :class="classNames"
    :style="styles"
  >
    <slot></slot>
  </span>
</template>
<style lang="less" scoped>
.h-badge {
  line-height: 1;
  @apply rounded;
  &-clickable {
    @apply cursor-pointer;
  }
  &-rounded {
    @apply rounded-full;
  }
}
</style>
