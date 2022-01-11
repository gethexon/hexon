<script setup lang="ts">
import type { ComputedRef, Ref } from "vue"
import type { ISlideViewItem } from "./interface"
import { computed, ref, watch } from "vue"
import TranslateTransitionGroup from "@/transitions/TranslateTransitionGroup.vue"
import { TranslateTransitionDirection } from "~/components/transitions/interface"

const props = withDefaults(
  defineProps<{
    current: number
    model: ISlideViewItem[]
    horizontal?: boolean
    reverted?: boolean
  }>(),
  {
    horizontal: false,
    reverted: false,
  }
)
const emits = defineEmits<{
  (e: "update:current", value: number): void
}>()
const model: ComputedRef<(ISlideViewItem & { idx: number })[]> = computed(
  () => {
    return props.model.map((item, idx) => ({ ...item, idx }))
  }
)
const pre = ref(false)
const tabs: Ref<(ISlideViewItem & { idx: number })[]> = ref([])
watch(
  () => props.current,
  (v, old) => {
    const item = model.value[v]
    if (!item) return
    tabs.value = [item]
    if (old) pre.value = v < old
  },
  {
    immediate: true,
  }
)
const setCurrent = (next: number) => {
  console.log({ next })
  emits("update:current", next)
}
const realPre = computed(() => (props.reverted ? !pre.value : pre.value))
const direction: ComputedRef<TranslateTransitionDirection> = computed(() =>
  props.horizontal
    ? realPre.value
      ? "left"
      : "right"
    : realPre.value
    ? "up"
    : "down"
)
</script>
<template>
  <div class="relative w-full h-full overflow-hidden">
    <TranslateTransitionGroup :direction="direction" :duration="200">
      <div
        class="absolute w-full h-full overflow-hidden"
        :key="item.idx"
        v-for="item in tabs"
      >
        <slot
          :component="item.component"
          :idx="item.idx"
          :setCurrent="setCurrent"
        >
          <Component
            :idx="item.idx"
            :is="item.component"
            :setCurrent="setCurrent"
          />
        </slot>
      </div>
    </TranslateTransitionGroup>
  </div>
</template>
