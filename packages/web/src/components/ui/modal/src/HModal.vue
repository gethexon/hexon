<script setup lang="ts">
import { ref, watch } from "vue"
import ClassProvider from "~/ClassProvider.vue"
import FadeScaleTransitionGroup from "@/transitions/FadeScaleTransitionGroup.vue"
import HBaseModal from "./HBaseModal.vue"
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
</script>
<template>
  <Teleport to="body">
    <FadeScaleTransitionGroup>
      <HBaseModal
        v-if="internalShow"
        :persistent="props.persistent"
        @on-close="hide"
      >
        <ClassProvider>
          <slot :hide="hide" />
        </ClassProvider>
      </HBaseModal>
    </FadeScaleTransitionGroup>
  </Teleport>
</template>
