<script lang="ts" setup>
import { useDispatcher } from "~/store/dispatcher"
import { useTheme } from "@/ui/theme"
import { HBaseModal } from "@/ui/modal"
import RSayDeleteConfirmForm from "@/forms/RSayDeleteConfirmForm.vue"
import { IRSaysListData } from "@/says/interface"

const props = defineProps<{
  close: () => void
  visible: boolean
  say: IRSaysListData
}>()
const dispatcher = useDispatcher()
const onConfirm = () => {
  if (props.say.date) {
    dispatcher.deleteSay(props.say.date)
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
      <RSayDeleteConfirmForm
        @on-confirm="onConfirm"
        @on-cancel="props.close"
      />
    </div>
  </HBaseModal>
</template>

<style lang="less" scoped>

</style>