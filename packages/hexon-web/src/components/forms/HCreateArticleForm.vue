<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { HCheckbox } from "@/ui/checkbox"
import { HInput } from "@/ui/input"
import { HButton } from "../ui/button"
import { HToggle } from "../ui/toggle"

const props = withDefaults(
  defineProps<{
    advanced?: boolean
  }>(),
  {
    advanced: false,
  }
)
const emits = defineEmits<{
  (e: "update:advanced", value: boolean): void
  (e: "on-cancel"): void
  (
    e: "on-create",
    value: {
      title: string
      slug?: string
      layout?: string
      path?: string
      replace?: boolean
    }
  ): void
}>()
const advanced = ref(props.advanced)
watch(
  () => props.advanced,
  (v) => {
    advanced.value = v
  }
)
watch(
  () => advanced.value,
  (v) => {
    emits("update:advanced", v)
  }
)

const title = ref("")
const slug = ref("")
const layout = ref("")
const path = ref("")
const replace = ref(false)
const page = computed(() => layout.value === "page")
const draft = computed(() => layout.value === "draft")
const disabled = computed(() => !title.value)
const width = "80px"
const onCreate = () => {
  if (!title.value) return
  emits("on-create", {
    title: title.value,
    slug: slug.value,
    layout: layout.value,
    path: path.value,
    replace: replace.value,
  })
}
const onCancel = () => {
  emits("on-cancel")
}
const text = computed(() => {
  if (page.value) return "页面"
  if (draft.value) return "草稿"
  return "文章"
})
</script>
<template>
  <div class="h-create-article-form w-96">
    <h2 class="mt-2 mb-8 text-xl font-bold text-main text-center">
      新建{{ text }}
    </h2>
    <form @submit.prevent="onCreate">
      <div
        class="grid gap-4 grid-rows-1"
        style="grid-template-columns: [labels] auto [controls] 1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          标题
        </div>
        <div style="grid-column: controls">
          <HInput v-model="title" type="secondary" :error="''" />
        </div>
      </div>
      <template v-if="!advanced">
        <div
          class="grid gap-4 grid-rows-1"
          style="grid-template-columns: [labels] auto [controls] 1fr"
        >
          <div
            :style="{ width }"
            class="label text-right"
            style="grid-column: labels"
          ></div>
          <div style="grid-column: controls" class="pl-2 flex justify-between">
            <div>
              <HCheckbox
                :checked="page"
                @update:checked="(v) => v && (layout = 'page')"
                class="mr-4"
              >
                页面
              </HCheckbox>
              <HCheckbox
                :checked="draft"
                @update:checked="(v) => v && (layout = 'draft')"
                class="mr-4"
              >
                草稿
              </HCheckbox>
            </div>
            <HButton
              type="primary"
              size="small"
              attr-type="button"
              inverted
              @click="advanced = true"
            >
              高级模式
            </HButton>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="grid gap-4 grid-rows-1"
          style="grid-template-columns: [labels] auto [controls] 1fr"
        >
          <div
            :style="{ width }"
            class="label text-right"
            style="grid-column: labels"
          >
            layout
          </div>
          <div style="grid-column: controls">
            <HInput v-model="layout" type="secondary" :error="''" />
          </div>
        </div>
        <div
          class="grid gap-4 grid-rows-1"
          style="grid-template-columns: [labels] auto [controls] 1fr"
        >
          <div
            :style="{ width }"
            class="label text-right"
            style="grid-column: labels"
          >
            slug
          </div>
          <div style="grid-column: controls">
            <HInput v-model="slug" type="secondary" :error="''" />
          </div>
        </div>
        <div
          class="grid gap-4 grid-rows-1"
          style="grid-template-columns: [labels] auto [controls] 1fr"
        >
          <div
            :style="{ width }"
            class="label text-right"
            style="grid-column: labels"
          >
            path
          </div>
          <div style="grid-column: controls">
            <HInput v-model="path" type="secondary" :error="''" />
          </div>
        </div>
        <div
          class="grid gap-4 grid-rows-1"
          style="grid-template-columns: [labels] auto [controls] 1fr"
        >
          <div
            :style="{ width }"
            class="label text-right"
            style="grid-column: labels"
          >
            replace
          </div>
          <div style="grid-column: controls" class="flex justify-between">
            <HToggle v-model:active="replace" />
            <HButton
              type="primary"
              size="small"
              attr-type="button"
              inverted
              @click="advanced = false"
            >
              简洁模式
            </HButton>
          </div>
        </div>
      </template>
      <div class="flex justify-end mt-6">
        <HButton
          type="common"
          size="small"
          class="mr-2"
          inverted
          @click="onCancel"
          attr-type="button"
        >
          取消
        </HButton>
        <HButton size="small" attr-type="submit" :disabled="disabled">
          创建
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
