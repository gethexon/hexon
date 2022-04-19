<script setup lang="ts">
import { NavListItem } from "./interface"
import HNavTitle from "./HNavTitle.vue"
import HNavItem from "./HNavItem.vue"

defineProps<{
  model: NavListItem[]
}>()
const emits = defineEmits<{
  (e: "on-select", value: string): void
}>()
const onClick = (value: string) => {
  emits("on-select", value)
}
</script>
<template>
  <template v-for="item in model">
    <HNavTitle v-if="item.type === 'title'">{{ item.label }}</HNavTitle>
    <HNavItem
      v-else
      :text="item.text"
      :icon="item.icon"
      :indent="item.indent"
      :color="item.color"
      :sub="item.sub"
      :selected="item.selected"
      :uppercase="item.uppercase"
      @click="onClick(item.key)"
    />
  </template>
</template>
