<script setup lang="ts">
import { useEventListener, useMouse } from "@vueuse/core"
import { computed, onMounted, ref, watch } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { HBadge } from "@/ui/badge"
import { useThemeVars } from "@/ui/theme"

const props = defineProps<{
  min: number
  max: number
  value: number
}>()
const emits = defineEmits<{
  (e: "update:value", v: number): void
}>()

const { classNames } = createClassNames("h-slider")
const vars = useThemeVars()
const internal = ref(props.value)
watch(
  () => props.value,
  (v) => {
    if (props.value < props.min || props.value > props.max) {
      emits("update:value", internal.value)
      return
    }
    internal.value = v
    updateHalf()
  }
)
watch(
  () => internal.value,
  (v) => {
    emits("update:value", v)
  }
)

const railRef = ref<HTMLElement | null>(null)
const handlersRef = ref<HTMLElement | null>(null)
const { x } = useMouse()
const dragging = ref(false)
const onDraggingStart = () => {
  dragging.value = true
}
useEventListener("mouseup", () => {
  dragging.value = false
})
useEventListener("mousemove", () => {
  onDragging()
})
const updateHalf = () => {
  const handlersEl = handlersRef.value!
  const handlersRect = handlersEl.getBoundingClientRect()
  half.value = handlersRect.width / 2
}

const onDragging = () => {
  if (!dragging.value) return
  updateHalf()
  const railEl = railRef.value!
  const railRect = railEl.getBoundingClientRect()
  const start = railRect.x + half.value
  const max = railRect.width - half.value * 2
  const current = x.value - start
  internal.value = Math.round(
    props.min +
      (props.max - props.min) * Math.max(0, Math.min(1, current / max))
  )
}
onMounted(() => {
  updateHalf()
})
const half = ref(0)
const railStyle = computed(() => ({
  padding: `0 ${half.value}px`,
  backgroundColor: vars.value.backgroundColorTertiary,
}))
const firstFillStyle = computed(() => ({
  backgroundColor: vars.value.colorPrimary,
  width: `${2 * half.value}px`,
  margin: `0 ${-half.value}px`,
}))
const fillStyle = computed(() => ({
  backgroundColor: vars.value.colorPrimary,
  width: `${dPercentage.value * 100}%`,
}))
const dPercentage = computed(() => internal.value / (props.max - props.min))
const handlerStyle = computed(() => ({
  margin: `0 ${-half.value}px`,
  left: `${dPercentage.value * 100}%`,
}))
</script>
<template>
  <div :class="classNames">
    <div class="rail rounded w-full" :style="railStyle" ref="railRef">
      <div class="relative w-full h-full">
        <div
          class="absolute top-0 bottom-0 left-0 rounded"
          :style="firstFillStyle"
        ></div>
        <div
          class="fill absolute top-0 bottom-0 left-0 rounded"
          :style="fillStyle"
        ></div>
        <div
          class="handlers absolute top-0 bottom-0 flex flex-col justify-center"
          ref="handlersRef"
          :style="handlerStyle"
        >
          <HBadge
            rounded
            class="cursor-pointer px-3 whitespace-nowrap"
            @mousedown="onDraggingStart"
          >
            <slot>{{ internal }}</slot>
          </HBadge>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.h-slider {
  height: 30px;
  @apply flex flex-col justify-center;
  .rail {
    height: 4px;
  }
}
</style>
