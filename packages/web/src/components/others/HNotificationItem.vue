<script setup lang="ts">
import { computed } from "vue"
import { INotificationItem, INotificationType } from "~/lib/notification"
import { HIcon, HIconName } from "@/ui/icon"
import { HButton, HButtonType } from "@/ui/button"
import { useThemeVars } from "@/ui/theme"

const props = defineProps<{
  data: INotificationItem
}>()
const transformType = (type: INotificationType): HButtonType => {
  if (type === "info") return "primary"
  return type
}
const vars = useThemeVars()
const type = computed(() => transformType(props.data.type))
const closeable = computed(
  () => props.data.permanent && !props.data.actions.length
)
const styleVars = computed(() => {
  let main = vars.value.colorPrimary
  switch (type.value) {
    case "success":
      main = vars.value.colorSuccess
      break
    case "warning":
      main = vars.value.colorWarning
      break
    case "error":
      main = vars.value.colorError
      break
    default:
      main = vars.value.colorPrimary
      break
  }
  return {
    bgColor: main,
    color: vars.value.textColorWhite,
    subColor: vars.value.textColorWhite,
  }
})
const onClose = () => props.data.close()
const onClick = () => props.data.onClick?.()
</script>
<template>
  <div
    class="h-notification-item w-72 rounded-md px-4 py-2 select-none shadow-lg flex-shrink-0 mt-1"
    :class="{ 'cursor-pointer': !!data.onClick }"
    @click="onClick"
  >
    <div class="flex items-center">
      <div class="flex-1">
        <div class="title text-sm font-bold">{{ data.title }}</div>
        <div class="desc text-sm" v-if="data.desc">{{ data.desc }}</div>
      </div>
      <HButton
        class="ml-2"
        :type="type"
        round
        @click.prevent="onClose"
        v-if="closeable"
      >
        <HIcon :name="HIconName.Cancel" />
      </HButton>
    </div>
    <div class="flex justify-end" v-if="data.actions">
      <HButton
        v-for="action in data.actions"
        @click="action.run"
        :type="type"
        size="small"
      >
        {{ action.label }}
      </HButton>
    </div>
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
