<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity"
import { ButtonHTMLAttributes } from "@vue/runtime-dom"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import { HButtonSize, HButtonType } from "./interface"

const props = withDefaults(
  defineProps<{
    type?: HButtonType
    inverted?: boolean
    round?: boolean
    block?: boolean
    attrType?: ButtonHTMLAttributes["type"]
    size?: HButtonSize
  }>(),
  {
    type: "primary",
    inverted: false,
    round: false,
    block: false,
    size: "medium",
  }
)
const { type, inverted, round, block, attrType } = toRefs(props)
const classes = computed(() => {
  return [
    {
      inverted: inverted.value,
      round: round.value,
      block: block.value,
    },
    props.size,
  ]
})
const theme = useTheme<HTheme>()!
// TODO 这个需要用 theme system 干掉，太恶心了
const styleVars = computed(() => {
  switch (type.value) {
    case "primary":
      return {
        bgColor: theme.value.color.primary.n,
        color: theme.value.color.white,
        hoverBgColor: theme.value.color.primary.l2,
        activeBgColor: theme.value.color.primary.l4,
        invertedColor: theme.value.color.primary.n,
        invertedBgColor: theme.value.color.background.transparent,
        invertedHoverBgColor: theme.value.color.primary.a9,
        invertedActiveBgColor: theme.value.color.primary.a8,
      }
    case "success":
      return {
        bgColor: theme.value.color.success.n,
        color: theme.value.color.white,
        hoverBgColor: theme.value.color.success.l2,
        activeBgColor: theme.value.color.success.l4,
        invertedColor: theme.value.color.success.n,
        invertedBgColor: theme.value.color.background.transparent,
        invertedHoverBgColor: theme.value.color.success.a9,
        invertedActiveBgColor: theme.value.color.success.a8,
      }
    case "error":
      return {
        bgColor: theme.value.color.error.n,
        color: theme.value.color.white,
        hoverBgColor: theme.value.color.error.l2,
        activeBgColor: theme.value.color.error.l4,
        invertedColor: theme.value.color.error.n,
        invertedBgColor: theme.value.color.background.transparent,
        invertedHoverBgColor: theme.value.color.error.a9,
        invertedActiveBgColor: theme.value.color.error.a8,
      }
    case "warning":
      return {
        bgColor: theme.value.color.warning.n,
        color: theme.value.color.white,
        hoverBgColor: theme.value.color.warning.l2,
        activeBgColor: theme.value.color.warning.l4,
        invertedColor: theme.value.color.warning.n,
        invertedBgColor: theme.value.color.background.transparent,
        invertedHoverBgColor: theme.value.color.warning.a9,
        invertedActiveBgColor: theme.value.color.warning.a8,
      }
    case "common":
      return {
        bgColor: theme.value.color.common.n,
        color: theme.value.color.white,
        hoverBgColor: theme.value.color.common.l2,
        activeBgColor: theme.value.color.common.l4,
        invertedColor: theme.value.color.common.n,
        invertedBgColor: theme.value.color.background.transparent,
        invertedHoverBgColor: theme.value.color.common.a9,
        invertedActiveBgColor: theme.value.color.common.a8,
      }
    default:
      return {
        bgColor: theme.value.color.common.n,
        color: theme.value.color.white,
        hoverBgColor: theme.value.color.common.l2,
        activeBgColor: theme.value.color.common.l4,
        invertedColor: theme.value.color.common.n,
        invertedBgColor: theme.value.color.background.transparent,
        invertedHoverBgColor: theme.value.color.common.a9,
        invertedActiveBgColor: theme.value.color.common.a8,
      } as never
  }
})
</script>

<template>
  <button
    class="h-button text-sm border-none outline-none rounded-2xl px-3 py-0 inline-flex items-center justify-center overflow-hidden cursor-pointer select-none flex-shrink-0"
    :class="classes"
    :type="attrType"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="less">
.h-button {
  transition: color 0.2s ease, background-color 0.2s ease;
  &.medium {
    @apply h-8;
  }

  &.small {
    @apply h-7;
  }
  &.block {
    @apply flex w-full;
  }
  &.round.medium {
    @apply w-8;
  }
  &.round.small {
    @apply w-7;
  }
  color: v-bind("styleVars.color");
  background-color: v-bind("styleVars.bgColor");
  &:hover {
    background-color: v-bind("styleVars.hoverBgColor");
  }
  &:active {
    background-color: v-bind("styleVars.activeBgColor");
  }
  &.inverted {
    color: v-bind("styleVars.invertedColor");
    background-color: v-bind("styleVars.invertedBgColor");
    &:hover {
      background-color: v-bind("styleVars.invertedHoverBgColor");
    }
    &:active {
      background-color: v-bind("styleVars.invertedActiveBgColor");
    }
  }
}
</style>
