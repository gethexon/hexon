<script lang="ts" setup>
import { useDispatcher } from "~/store/dispatcher"
import { useTheme } from "@/ui/theme"
import { HBaseModal } from "@/ui/modal"
import RSaysForm from "@/forms/RSaysForm.vue"

const props = defineProps<{
  close: () => void
  type: string
  visible: boolean
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
  dispatcher.createSay(date, options)
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
        @on-create="onCreate"
        @on-cancel="props.close"
      />
    </div>
  </HBaseModal>
</template>

<style lang="less" scoped>

</style>