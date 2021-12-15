<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, toRefs } from "vue"
import { onClickOutside } from "@vueuse/core"
import { useRect } from "./utils"
import { Position } from "./interface"

//#region props and emits
const props = withDefaults(
  defineProps<{
    show?: boolean
    position?: Position
    persistent?: boolean
  }>(),
  { show: false, position: "top", persistent: false }
)
const emits = defineEmits<{
  (e: "on-hide", value: boolean): void
}>()
const { show } = toRefs(props)
//#endregion

//#region refs
const instance = getCurrentInstance()
const containerElRef = ref<HTMLElement | null>(null)
const contentElRef = ref<HTMLElement | null>(null)
onMounted(() => {
  containerElRef.value = instance?.proxy?.$el.parentNode as HTMLElement
})
//#endregion

//#region rects
const containerRect = useRect(containerElRef)
const contentRect = useRect(contentElRef)
//#endregion

// BUG 直接修改 content element 的 id 不会更新 popover 位置

//#region click
onClickOutside(contentElRef, () => {
  if (props.show && !props.persistent) emits("on-hide", false)
})
//#endregion

//#region style
const style = computed(() => {
  let x = 0,
    y = 0,
    margin = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }
  switch (props.position) {
    case "top-left":
      x = containerRect.value.left
      y = containerRect.value.top - contentRect.value.height
      margin.bottom = 4
      break
    case "top":
      x =
        containerRect.value.left +
        containerRect.value.width / 2 -
        contentRect.value.width / 2
      y = containerRect.value.top - contentRect.value.height
      margin.bottom = 4
      break
    case "top-right":
      x =
        containerRect.value.left +
        containerRect.value.width -
        contentRect.value.width
      y = containerRect.value.top - contentRect.value.height
      margin.bottom = 4
      break
    case "right-top":
      x = containerRect.value.left + containerRect.value.width
      y = containerRect.value.top
      margin.left = 4
      break
    case "right":
      x = containerRect.value.left + containerRect.value.width
      y =
        containerRect.value.top +
        containerRect.value.height / 2 -
        contentRect.value.height / 2
      margin.left = 4
      break
    case "right-bottom":
      x = containerRect.value.left + containerRect.value.width
      y =
        containerRect.value.top +
        containerRect.value.height -
        contentRect.value.height
      margin.left = 4
      break
    case "bottom-left":
      x = containerRect.value.left
      y = containerRect.value.top + containerRect.value.height
      margin.top = 4
      break
    case "bottom":
      x =
        containerRect.value.left +
        containerRect.value.width / 2 -
        contentRect.value.width / 2
      y = containerRect.value.top + containerRect.value.height
      margin.top = 4
      break
    case "bottom-right":
      x =
        containerRect.value.left +
        containerRect.value.width -
        contentRect.value.width
      y = containerRect.value.top + containerRect.value.height
      margin.top = 4
      break
    case "left-top":
      x = containerRect.value.left - contentRect.value.width
      y = containerRect.value.top
      margin.right = 4
      break
    case "left":
      x = containerRect.value.left - contentRect.value.width
      y =
        containerRect.value.top +
        containerRect.value.height / 2 -
        contentRect.value.height / 2
      margin.right = 4
      break
    case "left-bottom":
      x = containerRect.value.left - contentRect.value.width
      y =
        containerRect.value.top +
        containerRect.value.height -
        contentRect.value.height
      margin.right = 4
      break
    default:
      break
  }
  return {
    outer: {
      transform: `translateX(${x}px) translateY(${y}px)`,
    },
    inner: {
      margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
    },
  }
})
//#endregion
</script>

<template>
  <teleport to="body">
    <div v-if="show" class="popover" ref="contentElRef" :style="style.outer">
      <div :style="style.inner">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>
<style scoped>
.popover {
  position: fixed;
  left: 0;
  top: 0;
  display: flow-root;
}
</style>
