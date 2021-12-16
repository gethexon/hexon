<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { toRefs, computed } from "vue"
import { HTheme } from "~/themes"
import { HIcon } from "./ui/icon"
import { HIconName } from "./ui/icon"

const props = withDefaults(
  defineProps<{
    icon: HIconName
    text: string
    indent?: number
    selected?: boolean
    color?: string
    sub?: string | number
  }>(),
  { indent: 0, selected: false, sub: "" }
)
const { icon, text, indent, selected, color } = toRefs(props)
const indents = computed(() => {
  if (indent.value === 0) return []
  else return new Array(indent.value).fill(0).map((v, i) => i)
})
const theme = useTheme<HTheme>()!
const styleVars = computed(() => {
  const color = theme.value.color.foreground.main
  const bgColor = selected.value
    ? theme.value.color.background.selected
    : theme.value.color.background.transparent
  const subColor = theme.value.color.foreground.sub
  const hoverBgColor = theme.value.color.background.hover
  const activeBgColor = theme.value.color.background.active
  return { color, bgColor, subColor, hoverBgColor, activeBgColor }
})
</script>
<template>
  <div
    class="
      h-nav-item
      px-4
      py-0.5
      mx-0
      my-0.5
      h-7
      rounded-md
      select-none
      cursor-pointer
      flex
      items-center
    "
  >
    <span class="w-4 inline-block" v-for="i in indents"> </span>
    <HIcon class="mr-3 text-lg" :style="{ color }" :name="icon" />
    <span class="text text-sm uppercase">
      {{ text }}
    </span>
    <span v-if="sub?.toString()" class="sub text-xs ml-2">
      {{ sub }}
    </span>
  </div>
</template>
<style scoped lang="less">
@import "../styles/mixins.less";
.h-nav-item {
  color: v-bind("styleVars.color");
  background-color: v-bind("styleVars.bgColor");
  transition: all 0.2s ease;

  .sub {
    color: v-bind("styleVars.subColor");
  }

  &:hover {
    background-color: v-bind("styleVars.hoverBgColor");
  }
  &:active {
    background-color: v-bind("styleVars.activeBgColor");
  }
  .text {
    .ellipsis(1);
  }
}
</style>
