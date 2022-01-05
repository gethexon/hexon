<script setup lang="ts">
import { computed, StyleValue } from "vue"
import { useThemeVars } from "../../theme"
const props = withDefaults(
  defineProps<{
    verticle?: boolean
    width?: number | string
    color?: string
  }>(),
  { verticle: false, width: 1 }
)
const width = computed(() => {
  if (typeof props.width === "number") return `${props.width}px`
  else return props.width
})
const vars = useThemeVars()
const styles = computed<StyleValue>(() => {
  const base: StyleValue = {
    backgroundColor: props.color ?? vars.value.backgroundColorHover,
  }
  if (props.verticle) {
    return {
      ...base,
      height: "100%",
      width: width.value,
    }
  } else {
    return {
      ...base,
      width: "100%",
      height: width.value,
    }
  }
})
</script>
<template>
  <div :style="styles"></div>
</template>
