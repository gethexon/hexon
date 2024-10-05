<script lang="ts" setup>
import { HButton } from "@/ui/button"

const emits = defineEmits<{
  (e: "on-cancel"): void
  (e: "on-confirm"): void
}>()

const width = "40px"
const onConfirm = () => {
  emits("on-confirm")
}
const onCancel = () => {
  emits("on-cancel")
}

</script>
<template>
  <div class="h-create-article-form w-96 select-none">
    <h2 class="mt-2 mb-8 text-xl font-bold text-center">确认删除</h2>
    <form @submit.prevent="onConfirm">
      <div class="text-center">确定要删除此条想法吗？<br>此操作无法撤销！</div>
      <div class="flex justify-end mt-6">
        <HButton
          attr-type="button"
          class="mr-2"
          inverted
          size="small"
          type="common"
          @click="onCancel"
        >
          取消
        </HButton>
        <HButton attr-type="submit" size="small">
          确认
        </HButton>
      </div>
    </form>
  </div>
</template>
<style lang="less" scoped>
.h-create-article-form {
  .label {
    line-height: 30px;
  }
}
</style>
