<script setup lang="ts">
import type { Ref } from "vue"
import { ref, computed, watch } from "vue"
import TranslateUpDownTransitionGroup from "@/transitions/TranslateUpDownTransitionGroup.vue"
import SettingsTabContainer from "./SettingsTabContainer.vue"
import { ISettingsTab } from "./interface"

const props = defineProps<{
  current: string
  model: ISettingsTab[]
}>()
const model = computed(() => {
  return props.model.map((item, idx) => ({ ...item, idx }))
})
const up = ref(false)
const tabs: Ref<ISettingsTab[]> = ref([])
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
    const { key, title, comp } = nextItem
    tabs.value = [
      {
        key,
        title,
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
    <div
      class="absolute w-full h-full overflow-hidden"
      :key="t.key"
      v-for="t in tabs"
    >
      <SettingsTabContainer :title="t.title">
        <Component :is="t.comp" />
      </SettingsTabContainer>
    </div>
  </TranslateUpDownTransitionGroup>
</template>
