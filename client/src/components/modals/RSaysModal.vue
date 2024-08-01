<script lang="ts" setup>
import { useDispatcher } from "~/store/dispatcher"
import { useTheme } from "@/ui/theme"
import { HBaseModal } from "@/ui/modal"
import RSaysForm from "@/forms/RSaysForm.vue"
import { IRSaysListData } from "@/says/interface"

const props = defineProps<{
  close: () => void
  type: string
  visible: boolean
  say?: IRSaysListData
}>()
const dispatcher = useDispatcher()
const onCreate = (value: {
  content?: string
  date: string
  images?: string
  server?: string
  id?: number
  video?: string
  videoLink?: string
  link?: string
}) => {
  const { date, ...options } = value
  if (props.type === "add") {
    dispatcher.createSay(date, options)
  } else if (props.type === "edit") {
    dispatcher.editSay(date, options)
  }
  props.close()
}
const theme = useTheme("unknown")
</script>

<template>
  <HBaseModal @on-close="props.close">
    <div
      :style="{
        backgroundColor: theme.backgroundColorSecondary,
      }"
      class="py-2 px-4 rounded-md"
    >
      <RSaysForm
        :type="props.type"
        :say="props.say"
        @on-create="onCreate"
        @on-cancel="props.close"
      />
    </div>
  </HBaseModal>
</template>

<style lang="less" scoped>

</style>