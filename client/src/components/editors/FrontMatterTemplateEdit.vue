<script setup lang="ts">
import HTextarea from "../ui/textarea/src/HTextarea.vue"
import HButton from "../ui/button/src/HButton.vue"
import { ref, watch } from "vue"
const props = defineProps<{
  value: { data: string }
}>()
const emits = defineEmits<{
  (e: "finish", v: string): void
  (e: "cancel"): void
}>()
const internal = ref("")
watch(
  () => props.value.data,
  (v) => {
    internal.value = v
  },
  {
    immediate: true,
  }
)
</script>
<template>
  <div>
    <div class="w-96 max-h-96 overflow-y-auto">
      <HTextarea v-model:value="internal" />
    </div>
    <div class="p-2 flex justify-end">
      <HButton class="mr-2" size="small" inverted @click="emits('cancel')">
        取消
      </HButton>
      <HButton size="small" @click="emits('finish', internal)">儲存</HButton>
    </div>
  </div>
</template>
