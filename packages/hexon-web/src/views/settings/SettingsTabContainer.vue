<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
<template>
  <div class="p-8 w-full h-full overflow-auto">
    <div class="py-4 text-2xl mb-4">
      {{ title }}
    </div>
    <slot></slot>
  </div>
</template>
