<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue"
import * as monaco from "monaco-editor"
import "./workers"
import { MonacoMarkdownExtension } from "./monaco-markdown"
import { PrettierFormatterExtension } from "./prettier-formatter-ext"
import { MarkdownImageExtension } from "./markdown-image-ext"
import { editorOptions } from "./monaco"
import { useMonacoTheme } from "./theme"

const props = defineProps<{
  value: string
  id: string
  fontFamily?: string
  onImageImport?: (files: File[]) => Promise<string | undefined>
}>()
const emits = defineEmits<{
  (e: "update:value", value: string): void
  (e: "on-save"): void
}>()
const dom = ref<HTMLElement>()
const dragging = ref(false)
const importing = ref(false)
let instance: monaco.editor.IStandaloneCodeEditor
let dragDepth = 0

function getImageFiles(data: DataTransfer | null) {
  if (!data) return []
  const files: File[] = []
  for (const item of Array.from(data.items)) {
    if (item.kind !== "file" || !item.type.startsWith("image/")) continue
    const file = item.getAsFile()
    if (file) files.push(file)
  }
  if (files.length) return files
  return Array.from(data.files).filter((file) => file.type.startsWith("image/"))
}

async function importImages(files: File[], dropPosition?: monaco.Position) {
  if (!files.length || !props.onImageImport) return
  const position = dropPosition ?? instance.getPosition()
  if (!position) return
  importing.value = true
  try {
    const markdown = await props.onImageImport(files)
    if (!markdown) return
    instance.executeEdits("hexon.image-import", [
      {
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        text: markdown,
        forceMoveMarkers: true,
      },
    ])
  } finally {
    importing.value = false
  }
}

function onDragEnter(event: DragEvent) {
  if (!getImageFiles(event.dataTransfer).length) return
  event.preventDefault()
  dragDepth += 1
  dragging.value = true
}

function onDragOver(event: DragEvent) {
  if (!getImageFiles(event.dataTransfer).length) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = "copy"
}

function onDragLeave(event: DragEvent) {
  if (!getImageFiles(event.dataTransfer).length) return
  event.preventDefault()
  dragDepth = Math.max(0, dragDepth - 1)
  if (!dragDepth) dragging.value = false
}

function onDrop(event: DragEvent) {
  const files = getImageFiles(event.dataTransfer)
  if (!files.length) return
  event.preventDefault()
  dragDepth = 0
  dragging.value = false
  const position =
    instance.getTargetAtClientPoint(event.clientX, event.clientY)?.position ??
    undefined
  void importImages(files, position)
}

function onPaste(event: ClipboardEvent) {
  const files = getImageFiles(event.clipboardData)
  if (!files.length) return
  event.preventDefault()
  void importImages(files)
}
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

  instance.addAction({
    id: "hexon.save",
    label: "Save Changes",
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
    run() {
      emits("on-save")
    },
  })
}
onMounted(() => {
  createInstance()
  dom.value?.addEventListener("dragenter", onDragEnter)
  dom.value?.addEventListener("dragover", onDragOver)
  dom.value?.addEventListener("dragleave", onDragLeave)
  dom.value?.addEventListener("drop", onDrop)
  dom.value?.addEventListener("paste", onPaste)
})
watch(
  () => props.fontFamily,
  () => {
    instance.dispose()
    createInstance()
  }
)
onBeforeUnmount(() => {
  dom.value?.removeEventListener("dragenter", onDragEnter)
  dom.value?.removeEventListener("dragover", onDragOver)
  dom.value?.removeEventListener("dragleave", onDragLeave)
  dom.value?.removeEventListener("drop", onDrop)
  dom.value?.removeEventListener("paste", onPaste)
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
  <div class="h-monaco-editor relative">
    <div class="instance w-full h-full overflow-hidden" ref="dom"></div>
    <div
      v-if="dragging"
      class="absolute inset-2 flex items-center justify-center rounded-md border-2 border-dashed pointer-events-none"
      style="background: rgba(56, 131, 199, 0.12)"
    >
      松开以上传图片
    </div>
    <div
      v-if="importing"
      class="absolute bottom-2 right-2 rounded-md px-3 py-1 text-sm pointer-events-none"
      style="background: rgba(0, 0, 0, 0.65); color: white"
    >
      图片上传中...
    </div>
  </div>
</template>
