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
  language?: string
  fontFamily?: string
  onImageImport?: (files: File[]) => Promise<string | undefined>
}>()

const emits = defineEmits<{
  (e: "update:value", value: string): void
  (e: "on-save"): void
}>()

const container = ref<HTMLElement>()
const dom = ref<HTMLElement>()

const dragging = ref(false)
const importing = ref(false)

let instance: monaco.editor.IStandaloneCodeEditor | undefined

/**
 * Monaco 编辑器中拖入图片时：
 *
 * dragenter / dragover:
 *   不能可靠地读取 File。
 *   这里只判断 DataTransferItem 的 kind/type。
 *
 * drop:
 *   才真正读取 File。
 *
 * 这是浏览器 Drag & Drop API 的正常行为。
 */

function isImageFile(file: File): boolean {
  return (
    file.type.startsWith("image/") ||
    /\.(gif|jpe?g|png|webp|bmp|svg|avif|heic|heif)$/i.test(file.name)
  )
}

/**
 * drop / paste 时真正获取图片文件。
 *
 * 注意：
 * DataTransfer.files 只能可靠地在 drop / paste 中读取。
 */
function getImageFiles(data: DataTransfer | null): File[] {
  if (!data) {
    return []
  }

  // 第一优先级：DataTransfer.files
  const files = Array.from(data.files).filter(isImageFile)

  if (files.length > 0) {
    return files
  }

  // 第二优先级：DataTransfer.items
  return Array.from(data.items)
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter((file): file is File => {
      return file !== null && isImageFile(file)
    })
}

/**
 * 拖拽阶段只判断“是不是文件拖拽”，
 * 不尝试读取 File。
 *
 * 因为 dragenter / dragover 阶段 DataTransfer
 * 处于 protected mode。
 */
function isFileDrag(data: DataTransfer | null): boolean {
  if (!data) {
    return false
  }

  return Array.from(data.items).some((item) => item.kind === "file")
}

/**
 * 拖拽阶段判断是否明确属于图片。
 *
 * Windows Explorer -> 浏览器的文件拖拽通常可以拿到：
 *
 *   item.kind === "file"
 *   item.type === "image/png"
 *
 * 但某些环境 type 可能为空。
 *
 * 因此这里：
 *   type 是 image/* -> true
 *   只有 file -> 也当作可接受的文件拖拽
 *
 * 最终是不是图片，在 drop 时再严格判断。
 */
function isPotentialImageDrag(data: DataTransfer | null): boolean {
  if (!data) {
    return false
  }

  const items = Array.from(data.items)

  for (const item of items) {
    if (item.kind !== "file") {
      continue
    }

    if (item.type.startsWith("image/")) {
      return true
    }
  }

  // 某些浏览器 / Electron / Windows 拖拽环境
  // item.type 可能为空，但 kind 仍然是 file。
  return items.some((item) => item.kind === "file")
}

/**
 * 上传图片并向 Monaco 插入 Markdown。
 */
async function importImages(files: File[], dropPosition?: monaco.Position) {
  if (!files.length) {
    return
  }

  if (!props.onImageImport) {
    return
  }

  if (!instance) {
    return
  }

  const position = dropPosition ?? instance.getPosition()

  if (!position) {
    return
  }

  importing.value = true

  try {
    const markdown = await props.onImageImport(files)

    if (!markdown) {
      return
    }

    if (!instance) {
      return
    }

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

    /**
     * 插入后将光标放到 Markdown 后面。
     */
    const model = instance.getModel()

    if (model) {
      const offset = model.getOffsetAt(position)
      const newOffset = offset + markdown.length
      const newPosition = model.getPositionAt(newOffset)

      instance.setPosition(newPosition)
      instance.revealPositionInCenterIfOutsideViewport(newPosition)
    }
  } finally {
    importing.value = false
  }
}

/**
 * dragenter
 *
 * 这里只判断 DataTransferItem，
 * 不读取 File。
 */
function onDragEnter(event: DragEvent) {
  event.preventDefault()

  if (!event.dataTransfer) {
    return
  }

  if (!isPotentialImageDrag(event.dataTransfer)) {
    return
  }

  dragging.value = true
}

/**
 * dragover
 *
 * 这是阻止浏览器把文件打开到新标签页的关键。
 *
 * 必须调用 preventDefault()。
 *
 * 不要在调用 preventDefault() 前因为“识别不到图片”
 * 而 return。
 */
function onDragOver(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()

  const data = event.dataTransfer

  if (!data) {
    return
  }

  /**
   * 只有文件拖拽才显示图片上传状态。
   *
   * 这里不能用 data.files。
   */
  if (isPotentialImageDrag(data)) {
    dragging.value = true
    data.dropEffect = "copy"
  } else if (isFileDrag(data)) {
    /**
     * 是文件，但当前还不能确定是不是图片。
     *
     * 仍然允许 drop。
     *
     * drop 时再进行严格判断。
     */
    dragging.value = true
    data.dropEffect = "copy"
  } else {
    data.dropEffect = "none"
  }
}

/**
 * dragleave
 *
 * 不使用 dragDepth。
 *
 * Monaco 内部有大量子元素，
 * dragenter / dragleave 很容易在内部节点之间反复触发。
 *
 * 这里判断鼠标是否真的离开编辑器容器。
 */
function onDragLeave(event: DragEvent) {
  event.preventDefault()

  const el = container.value

  if (!el) {
    dragging.value = false
    return
  }

  const rect = el.getBoundingClientRect()

  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom

  if (outside) {
    dragging.value = false
  }
}

/**
 * drop
 *
 * 第一行必须 preventDefault。
 *
 * 这样浏览器不会执行默认的：
 *
 *   “打开这个文件”
 *
 * 行为。
 */
function onDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()

  dragging.value = false

  const data = event.dataTransfer

  if (!data) {
    return
  }

  /**
   * 现在已经进入 drop，
   * DataTransfer.files 可以正常读取。
   */
  const files = getImageFiles(data)

  if (!files.length) {
    return
  }

  /**
   * 获取鼠标在 Monaco 中对应的位置。
   */
  const position = instance?.getTargetAtClientPoint(
    event.clientX,
    event.clientY
  )?.position

  void importImages(files, position ?? undefined)
}

/**
 * 粘贴图片。
 *
 * paste 同样可以正常读取 DataTransfer.files。
 */
function onPaste(event: ClipboardEvent) {
  const files = getImageFiles(event.clipboardData)

  if (!files.length) {
    return
  }

  event.preventDefault()

  void importImages(files)
}

/**
 * 创建 Monaco model。
 */
function resetModel() {
  if (!instance) {
    return
  }

  const oldModel = instance.getModel()

  const newModel = monaco.editor.createModel(
    props.value,
    props.language ?? "markdown"
  )

  instance.setModel(newModel)

  oldModel?.dispose()
}

/**
 * 创建 Monaco 实例。
 */
function createInstance() {
  if (!dom.value) {
    return
  }

  instance = monaco.editor.create(dom.value, {
    ...editorOptions,
    language: props.language ?? editorOptions.language,
    fontFamily: props.fontFamily ?? editorOptions.fontFamily,
  })

  if ((props.language ?? "markdown") === "markdown") {
    const mdExtension = new MonacoMarkdownExtension()
    mdExtension.activate(instance)

    const fmExtension = new PrettierFormatterExtension()
    fmExtension.activate(instance)

    const mdImgExtension = new MarkdownImageExtension()
    mdImgExtension.activate()
  }

  resetModel()

  instance.onDidChangeModelContent(() => {
    if (!instance) {
      return
    }

    emits("update:value", instance.getValue())
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

/**
 * 销毁 Monaco。
 */
function disposeInstance() {
  if (!instance) {
    return
  }

  const model = instance.getModel()

  instance.dispose()

  model?.dispose()

  instance = undefined
}

onMounted(() => {
  createInstance()

  const el = container.value

  if (!el) {
    return
  }

  /**
   * 捕获阶段监听。
   *
   * Monaco 内部有 textarea、view-lines、overlay 等大量元素，
   * capture 可以更可靠地捕获事件。
   */
  el.addEventListener("dragenter", onDragEnter, true)

  el.addEventListener("dragover", onDragOver, true)

  el.addEventListener("dragleave", onDragLeave, true)

  el.addEventListener("drop", onDrop, true)

  el.addEventListener("paste", onPaste)
})

watch(
  () => props.fontFamily,
  () => {
    disposeInstance()
    createInstance()
  }
)

watch(
  () => props.id,
  () => {
    resetModel()
  }
)

watch(
  () => props.value,
  (value) => {
    if (!instance) {
      return
    }

    if (instance.getValue() !== value) {
      instance.setValue(value)
    }
  }
)

onBeforeUnmount(() => {
  const el = container.value

  if (el) {
    el.removeEventListener("dragenter", onDragEnter, true)

    el.removeEventListener("dragover", onDragOver, true)

    el.removeEventListener("dragleave", onDragLeave, true)

    el.removeEventListener("drop", onDrop, true)

    el.removeEventListener("paste", onPaste)
  }

  disposeInstance()

  dragging.value = false
})

useMonacoTheme()
</script>

<template>
  <div ref="container" class="h-monaco-editor relative">
    <div ref="dom" class="instance w-full h-full overflow-hidden" />

    <div
      v-if="dragging"
      class="absolute inset-2 z-50 flex items-center justify-center rounded-md border-2 border-dashed pointer-events-none"
      style="background: rgba(56, 131, 199, 0.12)"
    >
      松开以上传图片
    </div>

    <div
      v-if="importing"
      class="absolute bottom-2 right-2 z-50 rounded-md px-3 py-1 text-sm pointer-events-none"
      style="background: rgba(0, 0, 0, 0.65); color: white"
    >
      图片上传中...
    </div>
  </div>
</template>
