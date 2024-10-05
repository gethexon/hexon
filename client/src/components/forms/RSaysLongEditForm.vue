<script lang="ts" setup>

import { computed, onMounted, ref } from "vue"
import { HInput, HInputRef } from "@/ui/input"
import { HButton } from "@/ui/button"
import { useThemeVars } from "@/ui/theme"
import { HTextarea } from "@/ui/textarea"
import { IRSaysListData } from "@/says/interface"

const props = defineProps<{
  type: string
  say?: IRSaysListData
}>()
const emits = defineEmits<{
  (e: "on-cancel"): void
  (
    e: "on-edit",
    value: {
      content?: string
      images?: string
    }
  ): void
}>()
const vars = useThemeVars()
const content = ref("")

const images = ref("")
const width = "40px"

const init = () =>{
  if(props.say){
    content.value=props.say.content || ""
    images.value=props.say.image?.join("\n") || ""
  }
}

const onEdit = () => {
  emits("on-edit", {
    content: content?.value,
    images: images?.value
  })
}

const onCancel = () => {
  emits("on-cancel")
}
const typeText = computed(() => {
  if (props.type === "content") return "内容"
  return "图片链接"
})
const contentInputRef = ref<HInputRef | null>(null)
onMounted(() => {
  init()
  contentInputRef.value?.focus()
})
</script>

<template>
  <div class="h-create-article-form w-96 select-none">
    <h2 class="mt-2 mb-8 text-xl font-bold text-center">详细编辑{{ typeText }}</h2>
    <form @submit.prevent="onEdit">
      <div
        v-if="props.type=='content'"
        class="grid gap-4 grid-rows-1"
        style="grid-template-columns: [labels] auto [controls] 1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          内容
        </div>
        <div style="grid-column: controls" class="overflow-auto h-96">
          <HTextarea
            v-model:value="content"
            :error="''"
          />
        </div>
      </div>

      <div
        v-if="props.type=='images'"
        class="grid gap-4 grid-rows-1 mt-4"
        style="grid-template-columns: [labels] auto [controls] 1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          图像
        </div>
        <div style="grid-column: controls" class="overflow-auto h-96">
          <HTextarea
            v-model:value="images"
            :error="''"
            placeholder="图像地址（换行隔开）"
          />
        </div>
      </div>


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