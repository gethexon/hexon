<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue"
import type { HButtonSize, HButtonType } from "./interface"
import { computed } from "vue"
import { createKey } from "~/utils/create-key"
import { createClassNames } from "~/utils/create-classnames"
import { useTheme } from "@/ui/theme/src"

const props = withDefaults(
  defineProps<{
    type?: HButtonType
    inverted?: boolean
    round?: boolean
    block?: boolean
    attrType?: ButtonHTMLAttributes["type"]
    size?: HButtonSize
    disabled?: boolean
  }>(),
  {
    type: "primary",
    inverted: false,
    round: false,
    block: false,
    size: "medium",
    disabled: false,
  }
)

const { classNames } = createClassNames("h-button", (add, m) => {
  props.round && add(m("round"))
  props.inverted && add(m("inverted"))
  props.disabled && add(m("disabled"))
  props.block && add(m("block"))
  add(m(props.size))
})

const theme = useTheme("Button")

const styleVars = computed(() => {
  if (props.inverted && props.disabled) {
    return {
      color: theme.value[createKey("colorActiveInverted", props.type)],
      backgroundColor: theme.value.colorWhite,
    }
  }
  if (props.inverted) {
    return {
      color: theme.value[createKey("color", props.type)],
      backgroundColor: theme.value.colorTransparent,
      colorHover: theme.value[createKey("color", props.type)],
      backgroundColorHover:
        theme.value[createKey("backgroundColorHoverInverted", props.type)],
      colorActive: theme.value[createKey("color", props.type)],
      backgroundColorActive:
        theme.value[createKey("backgroundColorActiveInverted", props.type)],
    }
  }
  if (props.disabled) {
    return {
      color: theme.value.colorWhite,
      backgroundColor:
        theme.value[createKey("backgroundColorActive", props.type)],
    }
  }
  return {
    color: theme.value.colorWhite,
    backgroundColor: theme.value[createKey("color", props.type)],
    colorHover: theme.value.colorWhite,
    backgroundColorHover:
      theme.value[createKey("backgroundColorHover", props.type)],
    colorActive: theme.value.colorWhite,
    backgroundColorActive:
      theme.value[createKey("backgroundColorActive", props.type)],
  }
})
</script>

<template>
  <button
    class="text-sm border-none outline-none rounded-2xl px-3 py-0 inline-flex items-center justify-center overflow-hidden cursor-pointer select-none flex-shrink-0"
    :class="classNames"
    :type="attrType"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="less">
.h-button {
  transition: color 0.2s ease, background-color 0.2s ease;
  color: v-bind("styleVars.color");
  background-color: v-bind("styleVars.backgroundColor");
  &:hover {
    color: v-bind("styleVars.colorHover");
    background-color: v-bind("styleVars.backgroundColorHover");
  }
  &:active {
    color: v-bind("styleVars.colorActive");
    background-color: v-bind("styleVars.backgroundColorActive");
  }
  &-disabled {
    cursor: not-allowed;
    &:hover {
      color: v-bind("styleVars.color");
      background-color: v-bind("styleVars.backgroundColor");
    }
    &:active {
      color: v-bind("styleVars.color");
      background-color: v-bind("styleVars.backgroundColor");
    }
  }

  &-medium {
    @apply h-8;
  }
  &-small {
    @apply h-7 px-4;
  }

  &-block {
    @apply flex w-full;
  }

  &-round&-medium {
    @apply w-8;
  }
  &-round&-small {
    @apply w-7;
  }
}
</style>
