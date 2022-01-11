<script setup lang="ts">
import type { Ref } from "vue"
import type { ISlideViewItem } from "./interface"
import { computed, ref, watch } from "vue"
import TranslateUpDownTransitionGroup from "@/transitions/TranslateUpDownTransitionGroup.vue"

const props = defineProps<{
  current: string
  model: ISlideViewItem[]
}>()
const model = computed(() => {
  return props.model.map((item, idx) => ({ ...item, idx }))
})
const up = ref(false)
const tabs: Ref<ISlideViewItem[]> = ref([])
watch(
  () => props.current,
  (v, old) => {
    const nextItem = model.value.find((item) => item.key === v)
    if (!nextItem) return
    if (old) {
      const currentItem = model.value.find((item) => item.key === old)!
      if (!currentItem) return
      const next = nextItem.idx
      const current = currentItem.idx
      up.value = next > current
    }
    const { key, component } = nextItem
    tabs.value = [
      {
        key,

        component,
      },
    ]
  },
  {
    immediate: true,
  }
)
</script>
<template>
  <div class="relative w-full h-full overflow-hidden">
    <TranslateUpDownTransitionGroup :up="up" :duration="200">
      <div
        class="absolute w-full h-full overflow-hidden"
        :key="item.key"
        v-for="(item, idx) in tabs"
      >
        <slot :key="item.key" :component="item.component" :idx="idx">
          <Component :is="item.component" />
        </slot>
      </div>
    </TranslateUpDownTransitionGroup>
  </div>
</template>
