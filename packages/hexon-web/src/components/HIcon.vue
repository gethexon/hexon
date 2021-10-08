<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity";
import { HIconName } from "./HIconName";

const props = withDefaults(
  defineProps<{
    name: HIconName;
    clickable?: boolean;
  }>(),
  {
    clickable: false,
  }
);
const { name, clickable } = toRefs(props);
const classes = computed(() => {
  return { clickable: clickable.value };
});
</script>
<template>
  <span class="h-icon" :class="classes">{{ name }}</span>
</template>
<style scoped lang="less">
.h-icon {
  font-family: "Segoe Fluent Icons";
}
.h-icon.clickable {
  cursor: pointer;
}
</style>
