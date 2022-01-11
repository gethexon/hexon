<script setup lang="ts">
import type { ComputedRef } from "vue"
import type { ISlideViewItem } from "~/components/ui/slide-view/src/interface"
import type { ISettingsTab } from "./interface"
import { computed } from "vue"
import HSlideView from "~/components/ui/slide-view/src/HSlideView.vue"
import SettingsTabContainer from "./SettingsTabContainer.vue"

const props = defineProps<{
  current: number
  model: ISettingsTab[]
}>()
const newModel: ComputedRef<ISlideViewItem[]> = computed(() =>
  props.model.map((item) => ({
    key: item.key,
    component: item.comp,
  }))
)
</script>
<template>
  <HSlideView :model="newModel" :current="current">
    <template #default="slotProps">
      <SettingsTabContainer :title="model[slotProps.idx].title">
        <Component :is="slotProps.component" />
      </SettingsTabContainer>
    </template>
  </HSlideView>
</template>
