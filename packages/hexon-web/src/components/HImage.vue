<script setup lang="ts">
import { withDefaults, toRefs, computed } from "vue";

const props = withDefaults(defineProps<{ size?: string | number }>(), {});
const { size, ...rest } = toRefs(props);
const style = computed(() => {
  return {
    maxHeight: size?.value,
    maxWidth: size?.value,
  };
});
</script>
<template>
  <img v-bind="rest" :style="style" />
</template>
