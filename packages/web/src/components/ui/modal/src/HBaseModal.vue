<script setup lang="ts">
import anime from "animejs"
import { ref } from "vue"
const props = withDefaults(
  defineProps<{
    persistent?: boolean
  }>(),
  { persistent: false }
)
const emits = defineEmits<{
  (e: "on-close"): void
}>()

const contentRef = ref<HTMLElement | null>(null)
const clickOutside = () => {
  if (!props.persistent) emits("on-close")
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
  <div
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
    <div ref="contentRef" @click.stop>
      <slot />
    </div>
  </div>
</template>
