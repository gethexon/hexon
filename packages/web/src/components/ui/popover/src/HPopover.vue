<script setup lang="ts">
import type { TriggerType } from "./interface"
import { onClickOutside, useElementHover, useEventListener } from "@vueuse/core"
import {
  Ref,
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  toRefs,
  watch,
} from "vue"
import { useThemeVars } from "@/ui/theme"
import FadeTransition from "@/transitions/FadeTransition.vue"
import { getPlacement } from "./get-placement"
import { Position } from "./interface"
import { useRect } from "./utils"

//#region props and emits
const props = withDefaults(
  defineProps<{
    show?: boolean
    position?: Position
    persistent?: boolean
    trigger?: TriggerType
    raw?: boolean
    duration?: number
  }>(),
  {
    show: false,
    position: "top",
    persistent: false,
    trigger: "click",
    raw: false,
  }
)
const emits = defineEmits<{
  (e: "update:show", value: boolean): void
}>()
const { show: propsShow } = toRefs(props)

const show = ref(false)
watch(
  () => propsShow.value,
  (v) => {
    show.value = v
  }
)
watch(
  () => show.value,
  (v) => {
    emits("update:show", v)
  }
)
//#endregion

//#region refs
const instance = getCurrentInstance()
const containerElRef: Ref<HTMLElement | null> = ref(null)
const contentElRef: Ref<HTMLElement | null> = ref(null)
onMounted(() => {
  containerElRef.value = instance?.proxy?.$el.parentNode as HTMLElement
})
//#endregion

//#region click
useEventListener(containerElRef, "click", () => {
  show.value = !show.value
})
//#endregion

//#region hover
const isHover = useElementHover(containerElRef as Ref<HTMLElement>)
watch(
  () => isHover.value,
  (hover) => {
    if (props.trigger === "hover") {
      show.value = hover
    }
  }
)
//#endregion

//#region rects
const containerRect = useRect(containerElRef)
const contentRect = useRect(contentElRef)
//#endregion

//#region click
onClickOutside(contentElRef, () => {
  if (show.value && !props.persistent) show.value = false
})
//#endregion

//#region style
const vars = useThemeVars()
const style = computed(() => {
  // FIXME 如果元素位置发生了变化，且没有 resize 或 scroll 则 popover 位置不会更新
  const { x, y, margin } = getPlacement(
    props.position,
    containerRect.value,
    contentRect.value
  )
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
    <FadeTransition :duration="duration">
      <div v-if="show" class="popover" ref="contentElRef" :style="style.outer">
        <div :style="style.inner">
          <slot v-if="raw"></slot>
          <div
            class="p-1 rounded-md text-sm"
            :style="{
              backgroundColor: vars.backgroundColorPop,
              color: vars.textColorPop,
            }"
            v-else
          >
            <slot></slot>
          </div>
        </div>
      </div>
    </FadeTransition>
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
