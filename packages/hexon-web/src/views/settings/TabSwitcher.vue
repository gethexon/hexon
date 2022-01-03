<script setup lang="ts">
import type { Component } from "vue"
import { computed, watch } from "vue"
import { ref } from "vue"
import TranslateUpDownTransitionGroup from "~/components/transitions/TranslateUpDownTransitionGroup.vue"

const props = defineProps<{
  current: string
  model: {
    key: string
    comp: Component
  }[]
}>()
const model = computed(() => {
  return props.model.map((item, idx) => ({ ...item, idx }))
})
const up = ref(false)
const tabs = ref<
  {
    key: string
    comp: Component
  }[]
>([])
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
    const { key, comp } = nextItem
    tabs.value = [
      {
        key,
        comp,
      },
    ]
  },
  {
    immediate: true,
  }
)
</script>
<template>
  <TranslateUpDownTransitionGroup :up="up" :duration="200">
    <Component :is="t.comp" :key="t.key" v-for="t in tabs" />
  </TranslateUpDownTransitionGroup>
</template>
