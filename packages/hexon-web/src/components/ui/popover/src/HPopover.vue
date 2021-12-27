<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onMounted,
  Ref,
  ref,
  toRefs,
  watch,
} from "vue"
import { onClickOutside, useElementHover, useEventListener } from "@vueuse/core"
import { useRect } from "./utils"
import { Position } from "./interface"
import { getPlacement } from "./get-placement"
import FadeTransition from "@/transitions/FadeTransition.vue"
import ClassProvider from "~/ClassProvider.vue"
import { TriggerType } from ".."
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"

//#region props and emits
const props = withDefaults(
  defineProps<{
    show?: boolean
    position?: Position
    persistent?: boolean
    trigger?: TriggerType
    raw?: boolean
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
const containerElRef = ref<HTMLElement | null>(null)
const contentElRef = ref<HTMLElement | null>(null)
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

const theme = useTheme<HTheme>()!
</script>

<template>
  <teleport to="body">
    <ClassProvider>
      <FadeTransition>
        <div
          v-if="show"
          class="popover"
          ref="contentElRef"
          :style="style.outer"
        >
          <div :style="style.inner">
            <slot v-if="raw"> </slot>
            <div
              class="p-1 rounded-md"
              :style="{
                backgroundColor: theme.color.common.d5,
                color: theme.color.white,
              }"
              v-else
            >
              <slot></slot>
            </div>
          </div>
        </div>
      </FadeTransition>
    </ClassProvider>
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
