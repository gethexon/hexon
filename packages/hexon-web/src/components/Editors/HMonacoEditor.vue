<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue"
import * as monaco from "monaco-editor"
import { editorOptions } from "./monaco"
import "./workers"
import { useMonacoTheme } from "./theme"
const props = defineProps<{
  value: string
  id: string
}>()
const emits = defineEmits<{
  (e: "update:value", value: string): void
}>()
const dom = ref<HTMLElement>()
let instance: monaco.editor.IStandaloneCodeEditor
function resetModal() {
  const modal = monaco.editor.createModel(props.value, "markdown")
  instance.setModel(modal)
}
onMounted(() => {
  instance = monaco.editor.create(dom.value!, editorOptions)
  resetModal()
  instance.onDidChangeModelContent(() => {
    emits("update:value", instance.getValue())
  })
})
onBeforeUnmount(() => {
  instance.dispose()
})
watch(
  () => props.id,
  () => {
    resetModal()
  }
)
watch(
  () => props.value,
  () => {
    if (instance.getValue() !== props.value) {
      instance.setValue(props.value)
    }
  }
)
useMonacoTheme()
</script>
<template>
  <div class="h-monaco-editor">
    <div class="instance w-full h-full overflow-hidden" ref="dom"></div>
  </div>
</template>
