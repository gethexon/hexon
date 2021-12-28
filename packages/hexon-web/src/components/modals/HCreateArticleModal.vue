<script setup lang="ts">
import { ref } from "vue"
import HCreateArticleForm from "@/forms/HCreateArticleForm.vue"
import { HModal } from "@/ui/modal"
import notification from "~/plugins/notification"

const props = defineProps<{
  show: boolean
}>()
const emits = defineEmits<{
  (e: "update:show", value: boolean): void
}>()
const advanced = ref(false)
const onCreate = (value: {
  title: string
  slug?: string
  layout?: string
  path?: string
  replace?: boolean
}) => {
  // FIXME 仅供测试
  notification.notify({
    type: "info",
    title: "on-create",
    // permanent: true,
    actions: [],
    desc: JSON.stringify(value, null, " "),
  })
  emits("update:show", false)
}
</script>
<template>
  <HModal
    :show="show"
    @update:show="(v) => emits('update:show', v)"
    :persistent="advanced"
  >
    <div class="bg-base-1 p-2 rounded-md">
      <HCreateArticleForm
        @on-create="onCreate"
        @on-cancel="emits('update:show', false)"
      />
    </div>
  </HModal>
</template>
