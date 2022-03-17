<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue"
import * as monaco from "monaco-editor"
import "./workers"
import { MonacoMarkdownExtension } from "monaco-markdown"
import { PrettierFormatterExtension } from "./prettier-formatter-ext"
import { MarkdownImageExtension } from "./markdown-image-ext"
import { editorOptions } from "./monaco"
import { useMonacoTheme } from "./theme"

const props = defineProps<{
  value: string
  id: string
  fontFamily?: string
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
function createInstance() {
  instance = monaco.editor.create(dom.value!, {
    ...editorOptions,
    fontFamily: props.fontFamily ?? editorOptions.fontFamily,
  })
  const mdExtension = new MonacoMarkdownExtension()
  mdExtension.activate(instance)

  const fmExtension = new PrettierFormatterExtension()
  fmExtension.activate(instance)

  const mdImgExtension = new MarkdownImageExtension()
  mdImgExtension.activate()

  resetModal()
  instance.onDidChangeModelContent(() => {
    const newValue = instance.getValue()
    emits("update:value", newValue)
  })
}
onMounted(() => {
  createInstance()
})
watch(
  () => props.fontFamily,
  () => {
    instance.dispose()
    createInstance()
  }
)
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
