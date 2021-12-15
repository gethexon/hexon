<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"
import { ref, toRefs, watch } from "vue"
import ClassProvider from "~/ClassProvider.vue"
const props = withDefaults(defineProps<{ show?: boolean }>(), { show: false })
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
const modalRef = ref<HTMLElement | null>(null)
onClickOutside(modalRef, () => {
  internalShow.value = false
})
const hide = () => {
  internalShow.value = false
}
</script>
<template>
  <teleport to="body">
    <transition name="h-modal">
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
      >
        <ClassProvider>
          <slot :hide="hide" />
        </ClassProvider>
      </div>
    </transition>
  </teleport>
</template>
<style>
.h-modal-enter-active,
.h-modal-leave-active {
  transition: opacity 0.2s ease;
}

.h-modal-enter-from,
.h-modal-leave-to {
  opacity: 0;
}
</style>
