<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { useThemeVars } from "../../theme"

const props = withDefaults(
  defineProps<{
    value: string
    error?: boolean
    placeholder?: string
  }>(),
  { error: false, placeholder: "" }
)
const emits = defineEmits<{
  (e: "update:value", v: string): void
}>()
const internal = ref(props.value)
watch(
  () => props.value,
  (v) => (internal.value = v)
)
watch(
  () => internal.value,
  (v) => {
    emits("update:value", v)
  }
)
const { classNames } = createClassNames("h-textarea", (add, m) => {
  props.error && add(m("error"))
})
const textareaRef = ref<HTMLElement | null>(null)
/**
 * @see https://github.com/gethexon/hexon/blob/master/packages/web/src/components/UI/MTextarea.vue
 */
const fitToContent = () => {
  if (!textareaRef.value || !textareaRef.value.parentElement) return
  // from Quasar
  const el = textareaRef.value
  const parent = textareaRef.value.parentElement
  // reset height of textarea to a small size to detect the real height
  // but keep the total control size the same
  parent.style.marginBottom = el.scrollHeight - 1 + "px"
  el.style.height = "1px"
  el.style.height = el.scrollHeight + "px"
  parent.style.marginBottom = ""
}
onMounted(() => {
  fitToContent()
})
watch(
  () => [props.value],
  () => {
    nextTick(() => {
      fitToContent()
    })
  },
  {
    immediate: true,
  }
)
const vars = useThemeVars()
</script>
<template>
  <div ref="parent" :class="classNames" class="w-full text-sm">
    <textarea
      ref="textareaRef"
      class="w-full outline-none rounded-lg px-4 py-2"
      @input="fitToContent"
      :placeholder="placeholder"
      :style="{
        backgroundColor: vars.backgroundColorPrimary,
      }"
      v-model="internal"
    ></textarea>
  </div>
</template>
<style lang="less">
.h-textarea {
  textarea {
    resize: none;
  }
}
</style>
