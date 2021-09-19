---
to: src/components/<%= name %>.vue
---
<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{ name: string }>();
const { name } = toRefs(props);
</script>
<template>
  <p>{{ name }}</p>
</template>
