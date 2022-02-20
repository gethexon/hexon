<script setup lang="ts">
import { computed, reactive, ref, toRefs } from "vue"
import useResizeObserver from "./useResizeObserver"
import useEventListener from "./useEventListener"

const px = (value: number) => `${value}px`

const positive = (value: number) => Math.max(value, 0)

type sepNumber = "" | "1" | "2"

const useCursoStyle = (type: string) => {
  const cursorStyle = ref("")

  const setCursor = () => {
    cursorStyle.value = document.body.style.cursor
    document.body.style.cursor = type
  }
  const resetCursor = () => {
    document.body.style.cursor = cursorStyle.value
  }
  return { setCursor, resetCursor }
}

//#region 配置
const props = withDefaults(
  defineProps<{
    sep1: {
      min: number
      max: number
    }
    sep2: {
      min: number
      max: number
    }
    sep1at: number
    sep2at: number
    sepHalfWidth?: number
  }>(),
  {
    sepHalfWidth: 5,
  }
)
const emits = defineEmits<{
  (e: "update:sep1at", value: number): void
  (e: "update:sep2at", value: number): void
}>()
const updateValue1 = (value: number) => {
  emits("update:sep1at", value)
}
const updateValue2 = (value: number) => {
  emits("update:sep2at", value)
}
const { sep1, sep2, sep1at, sep2at, sepHalfWidth } = toRefs(props)
//#endregion

//#region 变量
const container = ref<HTMLElement>()
const fullWidth = ref(0)
const origin = reactive({ x: 0, y: 0 })
const workingSep = ref<sepNumber>("")
//#endregion

//#region 处理拖动
const { setCursor, resetCursor } = useCursoStyle("col-resize")
const onSep1MouseDown = () => {
  workingSep.value = "1"
  window.addEventListener("mousemove", onMouseMove)
  setCursor()
}
const onSep2MouseDown = () => {
  workingSep.value = "2"
  window.addEventListener("mousemove", onMouseMove)
  setCursor()
}
const onSepMouseUp = () => {
  workingSep.value = ""
  window.removeEventListener("mousemove", onMouseMove)
  resetCursor()
}
const onMouseMove = (e: MouseEvent) => {
  if (workingSep.value === "1") {
    const next = e.clientX - origin.x
    if (next <= sep1.value.min) updateValue1(sep1.value.min)
    else if (next >= sep1.value.max) updateValue1(sep1.value.max)
    else updateValue1(next)
  } else if (workingSep.value === "2") {
    const next = e.clientX - origin.x - part1Width.value
    if (next <= sep2.value.min) updateValue2(sep2.value.min)
    else if (next >= sep2.value.max) updateValue2(sep2.value.max)
    else updateValue2(next)
  }
}
useEventListener(window, "mouseup", onSepMouseUp)
//#endregion

//#region 计算整体尺寸
const syncSize = (entry: ResizeObserverEntry) => {
  fullWidth.value = container.value?.clientWidth ?? 0
  origin.x = container.value?.offsetLeft ?? 0
  origin.y = container.value?.offsetTop ?? 0
}
useResizeObserver(container, syncSize)
//#endregion

//#region 计算样式
const part1Width = computed(() => sep1at.value)
const part1Style = computed(() => ({
  left: 0,
  width: px(part1Width.value),
}))
const part2Width = computed(() => sep2at.value)
const part2Style = computed(() => ({
  left: px(part1Width.value),
  width: px(part2Width.value),
}))
const part3Width = computed(() =>
  positive(fullWidth.value - part1Width.value - part2Width.value)
)
const part3Style = computed(() => ({
  left: px(part1Width.value + part2Width.value),
  width: px(part3Width.value),
}))
const sep1Style = computed(() => ({
  left: px(part1Width.value - sepHalfWidth.value),
  width: px(sepHalfWidth.value * 2),
}))
const sep2Style = computed(() => ({
  left: px(part1Width.value + part2Width.value - sepHalfWidth.value),
  width: px(sepHalfWidth.value * 2),
}))
//#endregion
</script>
<template>
  <div ref="container" class="split-view-container">
    <div class="split-view-view" :style="part1Style">
      <slot name="first" />
    </div>
    <div class="split-view-view" :style="part2Style">
      <slot name="second" />
    </div>
    <div class="split-view-view" :style="part3Style">
      <slot name="third" />
    </div>
    <div
      class="split-view-view split-view-seprator"
      :style="sep1Style"
      @mousedown="onSep1MouseDown"
    ></div>
    <div
      class="split-view-view split-view-seprator"
      :style="sep2Style"
      @mousedown="onSep2MouseDown"
    ></div>
  </div>
</template>

<style scope>
.split-view-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  position: relative;
}
.split-view-view {
  height: 100%;
  overflow: hidden;
  white-space: normal;
  position: absolute;
}
.split-view-seprator {
  user-select: none;
}
.split-view-seprator:hover {
  cursor: col-resize;
}
</style>
