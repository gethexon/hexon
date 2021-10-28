<script setup lang="ts">
const props = defineProps<{
  value: string;
}>();
const emits = defineEmits<{
  (e: "update:value", value: string): void;
}>();
const requestChange = (value: string) => emits("update:value", value);
const onInput = (e: Event) =>
  requestChange((e.target as HTMLInputElement)?.value);
</script>
<template>
  <input
    class="text-2xl font-bold outline-none py-4 w-full"
    :value="props.value"
    @input="onInput"
  />
</template>
