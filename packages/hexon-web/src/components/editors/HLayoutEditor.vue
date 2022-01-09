<script setup lang="ts">
import { ref, watch } from "vue"
import { HInput } from "@/ui/input"
const props = defineProps<{
  layout: string
}>()
const emits = defineEmits<{
  (e: "update:layout", v: string): void
}>()
const internal = ref(props.layout)
watch(
  () => props.layout,
  (v) => {
    internal.value = v
  }
)
watch(internal, (v) => {
  props.layout !== v && emits("update:layout", v)
})
</script>
<template>
  <div class="px-4">
    <HInput v-model="internal" placeholder="hexo-default" />
  </div>
</template>
