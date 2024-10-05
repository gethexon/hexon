<script lang="ts" setup>
import { useDispatcher } from "~/store/dispatcher"
import { useTheme } from "@/ui/theme"
import { HBaseModal } from "@/ui/modal"
import RSaysLongEditForm from "@/forms/RSaysLongEditForm.vue"
import { IRSaysListData } from "@/says/interface"

const props = defineProps<{
  close: () => void
  visible: boolean
  say: IRSaysListData
  type: string
}>()
const emits = defineEmits<{
  (e: "on-cancel"): void
  (
    e: "on-long-edit",
    value: {
      content?: string
      images?: string
    }
  ): void
}>()
const dispatcher = useDispatcher()
const onConfirm = (value: {
  content?: string
  images?: string
}) => {
  emits("on-long-edit", {
    content: value.content,
    images: value.images
  })
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
      <RSaysLongEditForm
        :type="props.type"
        :say="props.say"
        @on-edit="onConfirm"
        @on-cancel="props.close"
      />
    </div>
  </HBaseModal>
</template>

<style lang="less" scoped>

</style>