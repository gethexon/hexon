<script setup lang="ts">
import anime from "animejs"
import { ref, watch } from "vue"
import ClassProvider from "~/ClassProvider.vue"
import ModalFadeTransition from "./ModalFadeTransition.vue"
const props = withDefaults(
  defineProps<{ show?: boolean; persistent?: boolean }>(),
  { show: false, persistent: false }
)
const emits = defineEmits<{
  (e: "update:show", value: boolean): void
}>()
const internalShow = ref(props.show)
watch(
  () => props.show,
  (value) => {
    internalShow.value = value
  }
)
watch(
  () => internalShow.value,
  (value) => emits("update:show", value)
)
const hide = () => {
  internalShow.value = false
}
const contentRef = ref<HTMLElement | null>(null)
const clickOutside = () => {
  if (!props.persistent) hide()
  else
    anime({
      targets: contentRef.value,
      keyframes: [{ scale: 1.05 }, { scale: 1 }],
      duration: 200,
      easing: "easeInOutSine",
    })
}
</script>
<template>
  <teleport to="body">
    <ModalFadeTransition>
      <div
        v-if="internalShow"
        style="
          background-color: #00000088;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        "
        @click="clickOutside"
      >
        <ClassProvider>
          <div ref="contentRef" @click.prevent.stop>
            <slot :hide="hide" />
          </div>
        </ClassProvider>
      </div>
    </ModalFadeTransition>
  </teleport>
</template>
