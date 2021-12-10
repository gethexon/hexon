<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { toRefs, computed } from "vue"
import { HTheme } from "~/themes"
import HButton from "../HButton.vue"
import HIcon from "../HIcon.vue"
import { HIconName } from "../HIconName"

const props = withDefaults(
  defineProps<{
    type?: "primary" | "success" | "warning" | "error"
    title: string
    desc?: string
    closeable?: boolean
    clickable?: boolean
  }>(),
  { type: "primary", closeable: false, clickable: false }
)
const emits = defineEmits<{
  (e: "on-close"): void
  (e: "on-click"): void
}>()
const { type } = toRefs(props)
const theme = useTheme<HTheme>()!
const styleVars = computed(() => {
  let main = theme.value.color.primary.n
  switch (type.value) {
    case "success":
      main = theme.value.color.success.n
      break
    case "warning":
      main = theme.value.color.warning.n
      break
    case "error":
      main = theme.value.color.error.n
      break
    default:
      main = theme.value.color.primary.n
      break
  }
  return {
    bgColor: main,
    color: theme.value.color.foreground.min,
    subColor: theme.value.color.foreground.min,
  }
})
const onClose = () => emits("on-close")
const onClick = () => emits("on-click")
</script>
<template>
  <div
    class="
      h-notification-item
      w-72
      flex
      items-center
      rounded-md
      px-4
      py-2
      select-none
      shadow
      flex-shrink-0
    "
    :class="{ 'cursor-pointer': clickable }"
    @click="onClick"
  >
    <div class="flex-1">
      <div class="title text-sm font-bold">{{ title }}</div>
      <div class="desc text-sm" v-if="desc">{{ desc }}</div>
    </div>
    <HButton
      class="ml-2"
      :type="type"
      round
      inverted
      @click.prevent="onClose"
      v-if="closeable"
    >
      <HIcon :name="HIconName.Cancel" />
    </HButton>
  </div>
</template>
<style lang="less" scoped>
.h-notification-item {
  background-color: v-bind("styleVars.bgColor");
  .title {
    @apply font-bold;
    color: v-bind("styleVars.color");
  }
  .desc {
    color: v-bind("styleVars.subColor");
  }
}
</style>
