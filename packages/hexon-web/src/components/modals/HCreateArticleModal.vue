<script setup lang="ts">
import { ref } from "vue"
import { useDispatcher } from "~/store/dispatcher"
import HCreateArticleForm from "@/forms/HCreateArticleForm.vue"
import { useTheme } from "@/ui/theme"
import { HBaseModal } from "@/ui/modal"

const props = defineProps<{
  close: () => void
}>()
const dispatcher = useDispatcher()
const advanced = ref(false)
const onCreate = (value: {
  title: string
  slug?: string
  layout?: string
  path?: string
  replace?: boolean
}) => {
  const { title, ...options } = value
  dispatcher.createArticle(title, options)
  props.close()
}
const theme = useTheme("unknown")
</script>
<template>
  <HBaseModal :persistent="advanced" @on-close="props.close">
    <div
      class="bg-base-1 p-2 rounded-md"
      :style="{
        backgroundColor: theme.backgroundColorPrimary,
      }"
    >
      <HCreateArticleForm
        @on-create="onCreate"
        @on-cancel="props.close"
        v-model:advanced="advanced"
      />
    </div>
  </HBaseModal>
</template>
